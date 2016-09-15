"""
Factories for financialaid tests
"""
import datetime
from factory import SubFactory

from factory.django import DjangoModelFactory
from factory.fuzzy import (
    FuzzyAttribute,
    FuzzyInteger,
    FuzzyText,
    FuzzyChoice, FuzzyFloat, FuzzyDateTime)
import faker
from pytz import UTC

from courses.factories import ProgramFactory
from financialaid.models import TierProgram, Tier, FinancialAidStatus, FinancialAid
from profiles.factories import UserFactory


FAKE = faker.Factory.create()


class TierFactory(DjangoModelFactory):
    """
    Factory for Tier
    """
    name = FuzzyText()
    description = FuzzyText()

    class Meta:  # pylint: disable=missing-docstring, no-init, too-few-public-methods, old-style-class
        model = Tier


class TierProgramFactory(DjangoModelFactory):
    """
    Factory for TierProgram
    """
    program = SubFactory(ProgramFactory)
    tier = SubFactory(TierFactory)
    discount_amount = FuzzyInteger(low=0, high=12345)
    current = FuzzyAttribute(FAKE.boolean)
    income_threshold = FuzzyInteger(low=0, high=10000)

    class Meta:  # pylint: disable=missing-docstring, no-init, too-few-public-methods, old-style-class
        model = TierProgram


class FinancialAidFactory(DjangoModelFactory):
    """
    Factory for FinancialAid
    """
    user = SubFactory(UserFactory)
    tier_program = SubFactory(TierProgramFactory)
    status = FuzzyChoice(FinancialAidStatus.ALL_STATUSES)
    income_usd = FuzzyFloat(low=0, high=12345)
    original_income = FuzzyFloat(low=0, high=12345)
    original_currency = FuzzyText(length=3)
    country_of_income = FuzzyText(length=2)
    date_exchange_rate = FuzzyDateTime(datetime.datetime(2000, 1, 1, tzinfo=UTC))

    class Meta:  # pylint: disable=missing-docstring, no-init, too-few-public-methods, old-style-class
        model = FinancialAid
