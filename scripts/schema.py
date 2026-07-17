import pandera as pa

VALID_CATEGORIES = ["science", "technology", "philosophy"]
VALID_MODES = ["nice", "violence"]

schema = pa.DataFrameSchema({
    "topic": pa.Column(str, nullable=False),
    "category": pa.Column(str, checks=pa.Check.isin(VALID_CATEGORIES), nullable=False),
    "mode": pa.Column(str, checks=pa.Check.isin(VALID_MODES), nullable=False)
})
