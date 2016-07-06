"""Tests for the API"""
# pylint: disable=no-self-use
from django.core.urlresolvers import reverse

from .factories import ProgramFactory, CourseFactory
from search.base import ESTestCase


class ProgramTests(ESTestCase):
    """Tests for the Program API"""
    def test_lists_live_programs(self):
        """Live programs should show up"""
        prog = ProgramFactory.create(live=True)

        resp = self.client.get(reverse('programs-list'))

        assert len(resp.json) == 1
        assert prog.title == resp.json[0]['title']

    def test_doesnt_list_unlive_programs(self):
        """Not-live programs should NOT show up"""
        ProgramFactory.create(live=False)

        resp = self.client.get(reverse('programs-list'))

        assert len(resp.json) == 0


class CourseTests(ESTestCase):
    """Tests for the Course API"""
    def test_list_course_if_program_live(self):
        """
        If the course belongs to a live program, show it.
        """
        course = CourseFactory.create(program__live=True)

        resp = self.client.get(reverse('course-list'))

        assert len(resp.json) == 1
        assert resp.json[0]['id'] == course.id

    def test_doesnt_list_courses_from_unlive_programs(self):
        """
        If the course belongs to a non-live program, hide it.
        """
        CourseFactory.create(program__live=False)

        resp = self.client.get(reverse('course-list'))

        assert len(resp.json) == 0
