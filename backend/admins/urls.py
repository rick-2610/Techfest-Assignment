from django.urls import path
from . import views

urlpatterns = [
   path('', views.home, name='home'),
   path('users/', views.get_users, name='users'),
   path('users/<int:user_id>/', views.user_detail, name='user_detail'),
   path('projects/', views.get_projects, name='projects'),
   path('projects/create/', views.create_project, name='create_project'),
   path('projects/<int:project_id>/edit/', views.edit_project, name='edit_project'),
   path('projects/<int:project_id/delete/', views.delete_project, name='delete_project'),
   path('submissions/', views.get_submissions, name='submissions'),
   path('submissions/<str:user_email>/<int:project_id>', views.submission_review, name='submission_review'),
]