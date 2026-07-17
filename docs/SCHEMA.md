# Question Ingestion Schema

To import questions in bulk, provide a comma-separated text file (`.txt` or `.csv`) with three columns: `topic`, `category`, and `mode`.

## Data Columns

### `topic` (string, required)
The text of the question or argument.
Example: *"Is time travel possible?"*

### `category` (string, required)
The subject area. Must be one of:
- `Science`
- `Technology`
- `Philosophy`

### `mode` (string, required)
The question's tone. Must be one of:
- `nice` (civil, thought-provoking discussions)
- `violence` (controversial or polarizing arguments)

## Example file
```csv
topic,category,mode
"Is artificial intelligence a threat to humanity?","Technology","violence"
"What is the nature of consciousness?","Philosophy","nice"
```
