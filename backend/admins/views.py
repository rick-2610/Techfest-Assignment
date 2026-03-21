from django.shortcuts import render
from .models import *
from .serializers import *
from django.utils import timezone
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

from apis.models import User, Project, ProjectSubmission
from django.contrib import messages
from django.shortcuts import redirect




@staff_member_required
def home(request):
    context = {
        'total_users': User.objects.count(),
        'total_projects': Project.objects.count(),
        'pending_count': ProjectSubmission.objects.filter(submission_status='pending').count(),
        'approved_count': ProjectSubmission.objects.filter(submission_status='approved').count(),
    }
    return render(request, 'home.html', context)


@staff_member_required
def get_users(request):
    users = User.objects.all()
    return render(request, 'users.html', {'users': users})


@staff_member_required
def user_detail(request, user_id):
    user = get_object_or_404(User, id=user_id)
    submissions = ProjectSubmission.objects.filter(user=user).select_related('project')
    return render(request, 'user_detail.html', {
        'profile':     user,
        'submissions': submissions,
    })


@staff_member_required
def get_projects(request):
    projects = Project.objects.all().order_by('-created_at')
    return render(request, 'projects.html', {'projects': projects})

@staff_member_required
def create_project(request):
    if request.method == 'POST':
        try:
            tf_points_awarded = int(request.POST.get('tf_points_awarded', 0))
        except (TypeError, ValueError):
            tf_points_awarded = 0

        try:
            point_to_unlock = int(request.POST.get('point_to_unlock', 0))
        except (TypeError, ValueError):
            point_to_unlock = 0

        Project.objects.create(
            title=request.POST.get('title', '').strip(),
            category=request.POST.get('category', '').strip(),
            description=request.POST.get('description', '').strip(),
            skills_required=request.POST.get('skills_required', '').strip(),
            tf_points_awarded=tf_points_awarded,
            submission_deadline=request.POST.get('submission_deadline', '').strip(),
            point_to_unlock=point_to_unlock,
        )
        messages.success(request, 'Project created.')
        return redirect('projects')
    return render(request, 'project_form.html', {'action': 'Create'})


@staff_member_required
def edit_project(request, project_id):
    project = get_object_or_404(Project, project_id=project_id)
    if request.method == 'POST':
        project.title = request.POST.get('title', '').strip()
        project.category = request.POST.get('category', '').strip()
        project.description = request.POST.get('description', '').strip()
        project.skills_required = request.POST.get('skills_required', '').strip()
        try:
            project.tf_points_awarded = int(request.POST.get('tf_points_awarded', 0))
        except (TypeError, ValueError):
            project.tf_points_awarded = 0
        project.submission_deadline = request.POST.get('submission_deadline', '').strip()
        try:
            project.point_to_unlock = int(request.POST.get('point_to_unlock', 0))
        except (TypeError, ValueError):
            project.point_to_unlock = 0
        project.save()
        messages.success(request, 'Project updated.')
        return redirect('projects')
    return render(request, 'project_form.html', {
        'project': project,
        'action': 'Edit',
    })

@staff_member_required
def delete_project(request, project_id):
    project = get_object_or_404(Project, project_id=project_id)
    if request.method == 'POST':
        project.delete()
        messages.success(request, 'Project deleted')
    return redirect('projects')

@staff_member_required
def get_submissions(request):
    status_filter = request.GET.get('status', '')
    submissions = ProjectSubmission.objects.select_related('user', 'project')
    if status_filter:
        submissions = submissions.filter(submission_status=status_filter)
    return render(request, 'submissions.html', {
        'submissions':   submissions,
        'status_filter': status_filter,
    })

@staff_member_required
def submission_review(request, user_email, project_id):
    user = get_object_or_404(User, email=user_email)
    project = get_object_or_404(Project, project_id=project_id)
    submission = get_object_or_404(ProjectSubmission, user=user, project=project)

    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'approve':
            submission.submission_status = 'approved'
            submission.save()
            user.tf_points += submission.project.tf_points_awarded
            user.save()
            messages.success(request, f'Approved. {submission.project.tf_points_awarded} pts awarded to {user.name}.')
        elif action == 'reject':
            submission.submission_status = 'rejected'
            submission.save()
            messages.warning(request, 'Submission rejected.')
        return redirect('submissions')
    return render(request, 'submission_review.html', {'submission': submission})