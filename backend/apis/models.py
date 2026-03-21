from django.db import models

class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)

    pfp = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    phone = models.CharField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True ,blank=True)
    skills = models.TextField(null=True, blank=True)
    organization = models.CharField(max_length=255, blank=True)

    tf_points    = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.email}"


class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    category = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    skills_required = models.TextField(null=True, blank=True)
    tf_points_awarded = models.IntegerField(default=0)
    submission_deadline = models.DateTimeField(null=True, blank=True)
    point_to_unlock = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.category}"



class ProjectSubmission(models.Model):
    submission_status_choices = [
        ('not submitted', 'Not Submitted'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    submission_id = models.AutoField(primary_key=True)
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    submission_time = models.DateTimeField(blank=True, null=True)
    submission_status = models.CharField(max_length=255, choices=submission_status_choices)
    submission_link = models.CharField(blank=True, null=True)
    submission_file = models.FileField(upload_to='submission_files/', blank=True, null=True)
    submission_image = models.ImageField(upload_to='submission_images/', blank=True, null=True)

    comments = models.TextField()

    class Meta:
        unique_together = ('user', 'project')

    def __str__(self):
        return f"{self.project.title} - {self.user.name}: {self.submission_status}"