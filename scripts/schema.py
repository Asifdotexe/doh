"""
Schema for validating question data.
"""

import pandera as pa

# FIXME: Update as more categories or modes are added
VALID_CATEGORIES = ["science", "technology", "philosophy"]
VALID_MODES = ["nice", "violence"]

question_schema = pa.DataFrameSchema({
    # FIXME: Update as more categories or modes are added
    "topic": pa.Column(str, nullable=False),
    "category": pa.Column(str, checks=pa.Check.isin(VALID_CATEGORIES), nullable=False),
    "mode": pa.Column(str, checks=pa.Check.isin(VALID_MODES), nullable=False)
})
