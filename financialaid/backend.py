"""
Backend helper functions for financialaid
"""
from financialaid.constants import COUNTRY_INCOME_THRESHOLDS, DEFAULT_INCOME_THRESHOLD
from financialaid.models import FinancialAidStatus


def determine_tier_program(program, income):
    """
    Determines and returns the TierProgram for a given income.
    """
    # To determine the tier for a user, find the set of every tier whose income threshold is
    # less than or equal to the income of the user. The highest tier out of that set will
    # be the tier assigned to the user.
    tier_programs_set = program.tier_programs.filter(current=True, income_threshold__lte=income)
    tier_program = tier_programs_set.order_by("-income_threshold")[0]
    return tier_program


def determine_auto_approval(financial_aid):
    """
    Takes income and country code and returns a boolean if auto-approved.
    """
    income_threshold = COUNTRY_INCOME_THRESHOLDS.get(financial_aid.country_of_income, DEFAULT_INCOME_THRESHOLD)
    is_above_threshold = financial_aid.income_usd >= income_threshold

    if is_above_threshold:
        financial_aid.status = FinancialAidStatus.AUTO_APPROVED
    else:
        financial_aid.status = FinancialAidStatus.PENDING_DOCS
    financial_aid.save()

    # Add auditing here

    return is_above_threshold
