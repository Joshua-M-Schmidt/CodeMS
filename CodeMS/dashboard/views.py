from django.shortcuts import render
from landing.models import CourseRequest
from landing_private.models import CourseDate, CourseRegistration
from exam.models import Exam
from .forms import AddCourseDate
from django.http import HttpResponseRedirect

# Create your views here.

def deleteRequest(request, id):
    CourseRequest.objects.get(id=id).delete()
    return HttpResponseRedirect('/dashboard')

def deleteDate(request, id):
    CourseDate.objects.get(id=id).delete()
    return HttpResponseRedirect('/dashboard')

def dashboard(request):
    course_requests = CourseRequest.objects.all()
    course_dates = CourseDate.objects.all()
    course_registrations = CourseRegistration.objects.all()
    exams = Exam.objects.all()
    return render(request,
        "dashboard/dashboard.html",
        {
                "requests":course_requests,
                "course_dates":course_dates,
                "course_registrations":course_registrations,
                "exams":exams
        })

def editCourseDate(request, id):
    if request.method == 'POST':
        form = AddCourseDate(request.POST)
        if form.is_valid():
            course_date = CourseDate.objects.get(id=id)
            course_date.date = form.cleaned_data['date']
            course_date.time = form.cleaned_data['time']
            course_date.cost = form.cleaned_data['cost']
            course_date.status = form.cleaned_data['status']
            course_date.location = form.cleaned_data['location']
            course_date.location_post_id = form.cleaned_data['location_post_id']
            course_date.save()
            return HttpResponseRedirect('/dashboard')
    else:
        course_date = CourseDate.objects.get(id=id)
        form = AddCourseDate(initial={'date':course_date.date,'location':course_date.location,'location_post_id':course_date.location_post_id})
        return render(request,'dashboard/edit_course_date.html',{'course_date':course_date,'add_form': form})

def addCourseDate(request):
    if request.method == 'POST':
        form = AddCourseDate(request.POST)
        if form.is_valid():
            course_date = CourseDate.objects.create()
            course_date.date = form.cleaned_data['date']
            course_date.time = form.cleaned_data['time']
            course_date.cost = form.cleaned_data['cost']
            course_date.status = form.cleaned_data['status']
            course_date.location = form.cleaned_data['location']
            course_date.location_post_id = form.cleaned_data['location_post_id']
            course_date.save()
            return HttpResponseRedirect('/dashboard')
    else:
        form = AddCourseDate()
        return render(request,'dashboard/add_course_date.html',{'add_form': form})