import argparse
import json
import os
import pandas as pd
import pandera as pa

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "data", "questions.json")

VALID_CATEGORIES = ["Science", "Technology", "Philosophy"]
VALID_MODES = ["nice", "violence"]

schema = pa.DataFrameSchema({
    "topic": pa.Column(str, nullable=False),
    "category": pa.Column(str, checks=pa.Check.isin(VALID_CATEGORIES), nullable=False),
    "mode": pa.Column(str, checks=pa.Check.isin(VALID_MODES), nullable=False)
})

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

    # Read and validate CSV
    df = pd.read_csv(args.file)
    try:
        validated_df = schema.validate(df)
    except pa.errors.SchemaError as err:
        print(f"Validation failed:\n{err}")
        return

    # Load existing JSON
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        existing_data = json.load(f)

    max_id = get_max_id(existing_data)

    # Append new questions
    new_questions = []
    for _, row in validated_df.iterrows():
        max_id += 1
        new_questions.append({
            "id": str(max_id),
            "category": row["category"],
            "topic": row["topic"],
            "mode": row["mode"]
        })
    
    existing_data.extend(new_questions)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)

    print(f"Successfully ingested {len(new_questions)} questions.")

if __name__ == "__main__":
    main()
