from django.urls import path
from . import views

urlpatterns = [
    path('user-details/', views.get_user, name='get_user'),
    path('add-user/', views.add_user, name='add_user'),
    path('update/', views.update_user, name='update_user'),
    path('projects/', views.get_all_projects, name='get_all_projects'),
    path('latest-projs/', views.get_latest_projects, name='get_latest_projects'),
    path('projects/<int:project_id>/', views.get_project, name='get_project'),
    path('projects/<int:project_id>/unlock/', views.unlock_project, name='unlock_project'),
    path('projects/<int:project_id>/submit/', views.submit_project, name='submit_project'),
    path('projects/<int:project_id>/submission/', views.get_submission, name='get_submission'),
    path('myprojects/', views.get_user_submissions, name='get_user_submissions'),
]