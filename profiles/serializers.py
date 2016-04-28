"""
Serializers for user profiles
"""
from rest_framework.serializers import ModelSerializer, SerializerMethodField, Field

from profiles.models import Profile, Education


class EducationSerializer(ModelSerializer):
    id = Field()
    class Meta:
        model = Education
        fields = ('id', 'degree_name', 'graduation_date', 'subject', 'school_name', 'school_city', 'school_country')


class ProfileSerializer(ModelSerializer):
    """Serializer for Profile objects"""
    pretty_printed_student_id = SerializerMethodField()

    education = EducationSerializer(many=True)

    def get_pretty_printed_student_id(self, obj):
        """helper method for the SerializerMethodField"""
        # pylint: disable=no-self-use
        return obj.pretty_printed_student_id

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'education':
                for education in value:
                    instance, created = Education.objects.update_or_create(id=education.id, **education)
            else:
                setattr(instance, attr, value)
        instance.save()

        return instance



    class Meta:  # pylint: disable=missing-docstring
        model = Profile
        fields = (
            'filled_out',
            'account_privacy',
            'email_optin',
            'first_name',
            'last_name',
            'preferred_name',
            'country',
            'state_or_territory',
            'city',
            'birth_country',
            'birth_state_or_territory',
            'birth_city',
            'has_profile_image',
            'profile_url_full',
            'profile_url_large',
            'profile_url_medium',
            'profile_url_small',
            'date_of_birth',
            'preferred_language',
            'gender',
            'pretty_printed_student_id',
            'edx_level_of_education',
            'education'
        )
        read_only_fields = (
            'filled_out',
        )


class ProfileLimitedSerializer(ModelSerializer):
    """
    Serializer for Profile objects, limited to fields that other users are
    allowed to see if a profile is marked public.
    """
    class Meta:  # pylint: disable=missing-docstring
        model = Profile
        fields = (
            'preferred_name',
            'account_privacy',
            'country',
            'state_or_territory',
            'city',
            'has_profile_image',
            'profile_url_full',
            'profile_url_large',
            'profile_url_medium',
            'profile_url_small',
        )


class ProfilePrivateSerializer(ModelSerializer):
    """
    Serializer for Profile objects, limited to fields that other users are
    allowed to see if a profile is marked private.
    """
    class Meta:  # pylint: disable=missing-docstring
        model = Profile
        fields = (
            'account_privacy',
            'has_profile_image',
            'profile_url_full',
            'profile_url_large',
            'profile_url_medium',
            'profile_url_small',
        )
