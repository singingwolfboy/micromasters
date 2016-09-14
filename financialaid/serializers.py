"""
Serializers from financialaid
"""

from rest_framework import serializers

from financialaid.models import FinancialAid


class FinancialAidSerializer(serializers.ModelSerializer):
    """Serializer for Financial Aid objects"""
    class Meta:  # pylint: disable=missing-docstring
        model = FinancialAid
        fields = ('original_income', 'original_currency', 'program', )