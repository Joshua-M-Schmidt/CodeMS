from django.shortcuts import render
from landing.models import CourseRequest
from django.http import HttpResponseRedirect

# Create your views here.

def deleteRequest(request, id):
    CourseRequest.objects.get(id=id).delete()
    return HttpResponseRedirect('/dashboard')


def dashboard(request):
    course_requests = CourseRequest.objects.all()
    return render(request,
        "dashboard/dashboard.html")
