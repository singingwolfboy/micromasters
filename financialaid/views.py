"""
Views for financialaid
"""
import json

from django.conf import settings
from django.db.models import F
from django.views.generic import ListView
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from courses.models import CourseRun
from ecommerce.models import CoursePrice
from financialaid.models import FinancialAid, FinancialAidStatus
from financialaid.serializers import FinancialAidSerializer
from ui.views import get_bundle_url


class IncomeValidationView(CreateAPIView):
    """
    View for income validation API. Takes income and currency, then determines whether review
    is necessary, and if not, sets the appropriate tier for personalized pricing.
    """
    serializer_class = FinancialAidSerializer
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        """
        Used for returning the view, which hasn't been defined yet.
        """
        return None


class ReviewFinancialAidView(ListView):
    """
    View for reviewing financial aid requests.
    """
    paginate_by = 10
    context_object_name = "financial_aid_objects"
    template_name = "review_financial_aid.html"
    selected_status = None  # Used to modify queryset and in context

    def get_context_data(self, **kwargs):
        """
        Gets context for view
        """
        context = super().get_context_data(**kwargs)
        context["selected_status"] = self.selected_status
        # Create ordered list of (financial aid status, financial message)
        messages = FinancialAidStatus.STATUS_MESSAGES_DICT
        message_order = (
            FinancialAidStatus.PENDING_MANUAL_APPROVAL,
            FinancialAidStatus.APPROVED,
            FinancialAidStatus.REJECTED,
            FinancialAidStatus.AUTO_APPROVED
        )
        context["financial_aid_statuses"] = (
            (status, "Show: {message}".format(message=messages[status]))
            for status in message_order
        )
        # Required for styling
        context["style_src"] = get_bundle_url(self.request, "style.js")
        context["dashboard_src"] = get_bundle_url(self.request, "dashboard.js")
        js_settings = {
            "gaTrackingID": settings.GA_TRACKING_ID,
            "reactGaDebug": settings.REACT_GA_DEBUG,
            "authenticated": not self.request.user.is_anonymous(),
            "edx_base_url": settings.EDXORG_BASE_URL,
        }
        context["js_settings_json"] = json.dumps(js_settings)
        return context

    def get_queryset(self):
        """
        Gets queryset for ListView to return to view
        """
        # Get requested status
        self.selected_status = self.kwargs.get("status", None)
        if self.selected_status is None or self.selected_status not in FinancialAidStatus.ALL_STATUSES:
            self.selected_status = FinancialAidStatus.PENDING_MANUAL_APPROVAL
        financial_aids = FinancialAid.objects.filter(status=self.selected_status)

        # Annotate with adjusted price
        # Note: This implementation of retrieving a course price is a naive lookup that assumes
        # all course runs and courses will be the same price for the foreseeable future,
        # irrespective of the program. Therefore we can just take the price from any currently
        # enroll-able course run.
        course_price = CoursePrice.objects.filter(
            is_valid=True,
            course_run__in=CourseRun.objects.filter(CourseRun.get_active_enrollment_queryset())
        ).first()
        financial_aids = financial_aids.annotate(
            # This will raise a 500 if there is no course_price available, though this
            # should not happen unless the courses/etc aren't set up correctly
            adjusted_price=course_price.price - F("tier_program__discount_amount")
        )

        return financial_aids
