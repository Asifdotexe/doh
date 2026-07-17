import argparse
import json
import os
import pandas as pd
import pandera as pa
from schema import question_schema

# Path relative to this script ensures we can execute this from any directory
DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "data", "questions.json")

def get_max_id(questions_list: list[dict]) -> int:
    """
    Get the maximum integer ID from the existing questions to ensure sequential numbering.

    :param questions_list: List of question dictionaries containing string IDs.
    :return: The highest integer ID present, or 0 if the list is empty.
    """
    return max((int(question_dict.get("id", 0)) for question_dict in questions_list), default=0)

def main():
    parser = argparse.ArgumentParser(description="Ingest questions from CSV.")
    parser.add_argument("--file", required=True, help="Path to the .csv file")
    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Error: {args.file} not found.")
        return

    # Load into a dataframe to leverage our pandera schema for robust validation
    questions_df = pd.read_csv(args.file)

    # Users might provide inconsistent casing (e.g. "Science" vs "science").
    # We normalize to lowercase prior to validation so valid entries aren't falsely rejected.
    if "category" in questions_df.columns:
        questions_df["category"] = questions_df["category"].str.lower()
    if "mode" in questions_df.columns:
        questions_df["mode"] = questions_df["mode"].str.lower()

    try:
        validated_questions_df = question_schema.validate(questions_df)
    except pa.errors.SchemaError as err:
        print(f"Validation failed:\n{err}")
        return

    # Load existing JSON
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            existing_questions = json.load(f)
    except FileNotFoundError:
        print(f"Error: data file not found: {DATA_FILE}")
        return
    except json.JSONDecodeError as err:
        print(f"Error: existing data file contains invalid JSON: {err}")
        return

    max_id = get_max_id(existing_questions)

    # Append new questions
    new_questions = []
    for _, row in validated_questions_df.iterrows():
        max_id += 1
        new_questions.append({
            "id": str(max_id),
            "category": str(row["category"]).lower(),
            "topic": str(row["topic"]),
            "mode": str(row["mode"]).lower()
        })

    existing_questions.extend(new_questions)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(existing_questions, f, indent=2, ensure_ascii=False)

    print(f"Successfully ingested {len(new_questions)} questions.")

if __name__ == "__main__":
    main()
