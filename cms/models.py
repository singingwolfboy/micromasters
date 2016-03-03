"""
Page models for the CMS
"""
from django.db import models

from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore.fields import RichTextField
from wagtail.wagtailadmin.edit_handlers import FieldPanel

from courses.models import Program


class HomePage(Page):
    """
    CMS page representing the homepage.
    """
    def get_context(self, request):
        context = super(HomePage, self).get_context(request)

        context['programs'] = Program.objects.filter(live=True)
        return context


class ProgramPage(Page):
    """
    CMS page representing the department e.g. Biology
    """
    description = RichTextField(blank=True)
    program = models.OneToOneField('courses.Program')

    content_panels = Page.content_panels + [
        FieldPanel('description', classname="full"),
        FieldPanel('program'),
    ]
