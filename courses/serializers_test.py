"""
Tests for serializers
"""

from courses.factories import CourseRunFactory
from courses.serializers import CourseRunSerializer
from search.base import ESTestCase


class CourseRunSerializerTests(ESTestCase):
    """
    Tests for CourseRunSerializer
    """

    def test_program(self):  # pylint: disable=no-self-use
        """
        Make sure program id appears correctly
        """
        course_run = CourseRunFactory.create()
        result = CourseRunSerializer().to_representation(course_run)
        assert result['program'] == course_run.course.program.id
