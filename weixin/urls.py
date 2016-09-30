#coding=utf-8

'''
Author: Da
Date: 03072016
'''

"""weixin URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
import wechat.views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    url(r'^wechat', include('wechat.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^$', wechat.views.index),
    url(r'^help/$', wechat.views.help),
    url(r'^about/$', wechat.views.about),
    url(r'^search$', wechat.views.search),
]
