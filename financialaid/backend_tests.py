"""
Tests for financialaid view
"""
from django.db.models.signals import post_save

from factory.django import mute_signals

from courses.factories import ProgramFactory
from dashboard.models import ProgramEnrollment
from financialaid.backend import determine_tier_program, determine_auto_approval
from financialaid.factories import TierProgramFactory, FinancialAidFactory
from profiles.factories import ProfileFactory
from search.base import ESTestCase


class FinancialAidBackendTests(ESTestCase):
    """
    Tests for financialaid views
    """
    def setUp(self):
        """
        Sets up user, logs user in, and enrolls user in program
        """
        with mute_signals(post_save):
            self.profile = ProfileFactory.create()
        self.program = ProgramFactory.create(
            financial_aid_availability=True
        )
        self.tiers = {
            "0k": TierProgramFactory.create(program=self.program, income_threshold=0, current=True),
            "15k": TierProgramFactory.create(program=self.program, income_threshold=15000, current=True),
            "50k": TierProgramFactory.create(program=self.program, income_threshold=50000, current=True),
            "100k": TierProgramFactory.create(program=self.program, income_threshold=100000, current=True)
        }
        self.program_enrollment = ProgramEnrollment.objects.create(
            user=self.profile.user,
            program=self.program
        )

    def test_determine_tier_program(self):
        """
        Tests determine_tier_program()
        """
        assert determine_tier_program(self.program, 0) == self.tiers["0k"]
        assert determine_tier_program(self.program, 1000) == self.tiers["0k"]
        assert determine_tier_program(self.program, 15000) == self.tiers["15k"]
        assert determine_tier_program(self.program, 23500) == self.tiers["15k"]
        assert determine_tier_program(self.program, 50000) == self.tiers["50k"]
        assert determine_tier_program(self.program, 72800) == self.tiers["50k"]
        assert determine_tier_program(self.program, 100000) == self.tiers["100k"]
        assert determine_tier_program(self.program, 34938234) == self.tiers["100k"]

    def test_determine_auto_approval(self):  # pylint: disable=no-self-use
        """
        Tests determine_auto_approval()
        """
        # Assumes US threshold is 100000
        financial_aid = FinancialAidFactory.create(
            income_usd=150000,
            country_of_income="US"
        )
        assert determine_auto_approval(financial_aid)
        financial_aid = FinancialAidFactory.create(
            income_usd=1000,
            country_of_income="US"
        )
        assert not determine_auto_approval(financial_aid)

        # Assumes IN threshold is 15000
        financial_aid = FinancialAidFactory.create(
            income_usd=20000,
            country_of_income="IN"
        )
        assert determine_auto_approval(financial_aid)
        financial_aid = FinancialAidFactory.create(
            income_usd=1000,
            country_of_income="IN"
        )
        assert not determine_auto_approval(financial_aid)

        # Assumes KP threshold is 0
        financial_aid = FinancialAidFactory.create(
            income_usd=3000,
            country_of_income="KP"
        )
        assert determine_auto_approval(financial_aid)
        financial_aid = FinancialAidFactory.create(
            income_usd=0,
            country_of_income="KP"
        )
        assert determine_auto_approval(financial_aid)
