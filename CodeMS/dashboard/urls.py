from django.urls import path, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

urlpatterns = [
    path('',views.dashboard, name="dashboard"),
    path('add_date',views.addCourseDate, name="addDate"),
    path('delete_request/<int:id>', views.deleteRequest, name="deleteRequest"),
    path('delete_date/<int:id>', views.deleteDate, name="delete_date"),
    path('edit_course/<int:id>', views.editCourseDate, name="editCourse"),
]

    