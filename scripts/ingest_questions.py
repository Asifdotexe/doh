import argparse
import json
import os
import pandas as pd
import pandera as pa
from schema import schema

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "data", "questions.json")

def get_max_id(data):
    if not data: return 0
    return max([int(q.get("id", 0)) for q in data])

def main():
    parser = argparse.ArgumentParser(description="Ingest questions from CSV.")
    parser.add_argument("--file", required=True, help="Path to the .csv file")
    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Error: {args.file} not found.")
        return

    # Read CSV
    df = pd.read_csv(args.file)

    # Normalize cases to lowercase to prevent trivial validation errors
    if "category" in df.columns:
        df["category"] = df["category"].str.lower()
    if "mode" in df.columns:
        df["mode"] = df["mode"].str.lower()

    try:
        validated_df = schema.validate(df)
    except pa.errors.SchemaError as err:
        print(f"Validation failed:\n{err}")
        return

    # Load existing JSON
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            existing_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: data file not found: {DATA_FILE}")
        return
    except json.JSONDecodeError as err:
        print(f"Error: existing data file contains invalid JSON: {err}")
        return

    max_id = get_max_id(existing_data)

    # Append new questions
    new_questions = []
    for _, row in validated_df.iterrows():
        max_id += 1
        new_questions.append({
            "id": str(max_id),
            "category": row["category"].lower(),
            "topic": row["topic"],
            "mode": row["mode"].lower()
        })

    existing_data.extend(new_questions)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)

    print(f"Successfully ingested {len(new_questions)} questions.")

if __name__ == "__main__":
    main()
