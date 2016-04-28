"""
Models for user profile
"""
from django.contrib.auth.models import User
from django.db import models, transaction
from django.db.models import Max
from jsonfield import JSONField

DOCTORATE = 'p'
MASTERS = 'm'
BACHELORS = 'b'
ASSOCIATE = 'a'
HIGH_SCHOOL = 'hs'
JUNIOR_HIGH_SCHOOL = 'jhs'
ELEMENTARY = 'el'
NO_FORMAL_EDUCATION = 'none'
OTHER_EDUCATION = 'other'


class Profile(models.Model):
    """
    A user profile
    """
    PRIVATE = 'private'
    PUBLIC_TO_MM = 'public_to_mm'
    PUBLIC = 'public'
    ACCOUNT_PRIVACY_CHOICES = (
        (PRIVATE, 'Private'),
        (PUBLIC_TO_MM, 'Public to logged in users'),
        (PUBLIC, 'Public to everyone'),
    )

    # Defined in edX UserProfile model
    MALE = 'm'
    FEMALE = 'f'
    OTHER = 'o'
    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (OTHER, 'Other/Prefer Not to Say'),
    )

    LEVEL_OF_EDUCATION_CHOICES = (
        (DOCTORATE, 'Doctorate'),
        (MASTERS, "Master's or professional degree"),
        (BACHELORS, "Bachelor's degree"),
        (ASSOCIATE, "Associate degree"),
        (HIGH_SCHOOL, "High school"),
        (JUNIOR_HIGH_SCHOOL, "Junior high school"),
        (ELEMENTARY, "Elementary school"),
        (NO_FORMAL_EDUCATION, "No formal education"),
        (OTHER_EDUCATION, "Other education"),
    )

    user = models.OneToOneField(User)

    # Is the profile filled out yet?
    filled_out = models.BooleanField(default=False)
    # Defining these here instead of in User to avoid Django's 30 character max limit
    first_name = models.TextField(blank=True, null=True)
    last_name = models.TextField(blank=True, null=True)
    preferred_name = models.TextField(blank=True, null=True)

    account_privacy = models.TextField(
        default=PRIVATE,
        choices=ACCOUNT_PRIVACY_CHOICES,
    )

    # Has user opted to receive email?
    email_optin = models.BooleanField(default=False)

    edx_employer = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    edx_job_title = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    edx_name = models.TextField(blank=True, null=True)
    edx_bio = models.TextField(blank=True, null=True)

    city = models.TextField(blank=True, null=True)
    country = models.TextField(blank=True, null=True)
    state_or_territory = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    birth_city = models.TextField(blank=True, null=True)
    birth_country = models.TextField(blank=True, null=True)
    birth_state_or_territory = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    has_profile_image = models.BooleanField(default=False)
    profile_url_full = models.TextField(blank=True, null=True)
    profile_url_large = models.TextField(blank=True, null=True)
    profile_url_medium = models.TextField(blank=True, null=True)
    profile_url_small = models.TextField(blank=True, null=True)
    edx_requires_parental_consent = models.NullBooleanField()
    date_of_birth = models.DateField(blank=True, null=True)
    edx_level_of_education = models.TextField(
        max_length=6,
        choices=LEVEL_OF_EDUCATION_CHOICES,
        blank=True,
        null=True,
    )
    edx_goals = models.TextField(blank=True, null=True)
    preferred_language = models.TextField(blank=True, null=True)
    edx_language_proficiencies = JSONField(blank=True, null=True)
    gender = models.CharField(
        max_length=6,
        choices=GENDER_CHOICES,
        blank=True,
        null=True,
    )
    edx_mailing_address = models.TextField(blank=True, null=True)
    date_joined_micromasters = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    linkedin = JSONField(blank=True, null=True)
    student_id = models.IntegerField(blank=True, null=True, unique=True)

    @transaction.atomic
    def save(self, *args, **kwargs):
        """need to handle setting the student_id number"""
        if self.id is None or self.student_id is None:
            max_id = Profile.objects.aggregate(Max('student_id'))
            max_id = max_id['student_id__max'] or 1
            iteration_limit = 1000
            while Profile.objects.filter(student_id=max_id).exists() and iteration_limit > 0:
                max_id += 1
                iteration_limit -= 1
            self.student_id = max_id
        super(Profile, self).save(*args, **kwargs)

    def __str__(self):
        return 'Profile for "{0}"'.format(self.user.username)

    @property
    def pretty_printed_student_id(self):
        """pretty prints the student id for easy display"""
        return "MMM{0:06}".format(self.student_id) if self.student_id else ""


class Education(models.Model):
    DEGREE_CHOICES = (
        (DOCTORATE, 'Doctorate'),
        (MASTERS, "Master's or professional degree"),
        (BACHELORS, "Bachelor's degree"),
        (ASSOCIATE, "Associate degree"),
        (HIGH_SCHOOL, "High school"),
        (OTHER_EDUCATION, "Other education"),
    )
    profile = models.ForeignKey(Profile, related_name='education')
    degree_name = models.CharField(max_length=30, choices=DEGREE_CHOICES)
    graduation_date = models.DateField()
    subject = models.CharField(max_length=30)
    school_name = models.CharField(max_length=50)
    school_city = models.CharField(max_length=30)
    school_country = models.CharField(max_length=30)