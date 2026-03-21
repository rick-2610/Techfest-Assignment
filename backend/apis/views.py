from django.shortcuts import render
from .models import *
from .serializers import *
from django.utils import timezone

from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

@api_view(['GET'])
def get_user(request):
    try: 
        email = request.headers.get('Email')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'No user found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_user(request):
    email = request.headers.get('Email')
    name = request.headers.get('Name')

    if not email or not name:
        return Response({'error': 'Email and name are required'}, status=status.HTTP_400_BAD_REQUEST)

    user, created = User.objects.get_or_create(email=email, defaults={'name': name})

    return Response({'user': UserSerializer(user).data,}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
def update_user(request):
    email = request.headers.get('Email')

    if not email:
        return Response({'error': 'Email header is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_all_projects(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_latest_projects(request):
    projects = Project.objects.order_by('-created_at')[:3]
    serializer = ProjectSerializer(projects, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_project(request, project_id):
    try:
        project = Project.objects.get(project_id=project_id)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
    return Response(ProjectSerializer(project).data)


@api_view(['GET'])
def get_submission(request, project_id):
    email = request.headers.get('Email')
    if not email:
        return Response({'error': 'Email not found'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
        project = Project.objects.get(project_id=project_id)
        submission = ProjectSubmission.objects.get(user=user, project=project)
        return Response(ProjectSubmissionSerializer(submission).data)
    except ProjectSubmission.DoesNotExist:
        return Response({'error': 'Not unlocked'}, status=status.HTTP_404_NOT_FOUND)
    except (User.DoesNotExist, Project.DoesNotExist):
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def unlock_project(request, project_id):
    email = request.headers.get('Email')
    if not email:
        return Response({'error': 'Email header required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user    = User.objects.get(email=email)
        project = Project.objects.get(project_id=project_id)
    except (User.DoesNotExist, Project.DoesNotExist) as e:
        return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

    if ProjectSubmission.objects.filter(user=user, project=project).exists():
        return Response({'error': 'Already unlocked'}, status=status.HTTP_400_BAD_REQUEST)

    if user.tf_points < project.point_to_unlock:
        return Response({'error': 'Insufficient points'}, status=status.HTTP_400_BAD_REQUEST)

    user.tf_points -= project.point_to_unlock
    user.save()

    submission = ProjectSubmission.objects.create(
        user=user,
        project=project,
        submission_status='not submitted',
    )

    return Response({
        'submission': ProjectSubmissionSerializer(submission).data,
        'remaining_points': user.tf_points,
    }, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@parser_classes([MultiPartParser, FormParser])
def submit_project(request, project_id):
    email = request.headers.get('Email')

    if not email:
        return Response({'error': 'Email not found'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
        project = Project.objects.get(project_id=project_id)
        submission = ProjectSubmission.objects.get(user=user, project=project)

    except ProjectSubmission.DoesNotExist:
        return Response({'error': 'Not unlocked'}, status=status.HTTP_404_NOT_FOUND)
    except (User.DoesNotExist, Project.DoesNotExist):
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


    serializer = ProjectSubmissionSerializer(submission, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save(submission_status='pending', submission_time=timezone.now())
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_user_submissions(request):
    email = request.headers.get('Email')

    if not email:
        return Response({'error': 'Email header required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    submissions = ProjectSubmission.objects.filter(user=user).select_related('project')
    data = [
        {
            'project_id': sub.project.project_id,
            'title': sub.project.title,
            'category': sub.project.category,
            'tf_points_awarded': sub.project.tf_points_awarded,
            'submission_deadline': sub.project.submission_deadline,
            'submission_status': sub.submission_status,
        }
        for sub in submissions
    ]
    return Response(data)
