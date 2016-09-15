"""
Constants for financialaid
"""

import csv
import os

from django.conf import settings


DEFAULT_INCOME_THRESHOLD = 100000
with open(os.path.join(settings.BASE_DIR, "data/country_income_thresholds.csv"), mode="r") as file:
    reader = csv.DictReader(file)
    COUNTRY_INCOME_THRESHOLDS = {row["country"]: int(row["income"]) for row in reader}
