# This is a Dockerfile to create an image

# VERSION 1.0

# use ubuntu image provided by https://registry.hub.docker.com/_/ubuntu/
FROM ubuntu:14.04
MAINTAINER Matt Rouse, Rodney Jonace, Will Adkins

# make sure the package repo is up to date
# RUN echo “deb http://archive.ubuntu.com/ubuntu precise main universe” > /etc/apt/sources.list
RUN apt-get update

# install compilers
RUN apt-get install -y gcc
RUN apt-get install -y python

#prepare for Java download
RUN apt-get install -y python-software-properties
RUN apt-get install -y software-properties-common

#grab oracle java (auto accept licence)
RUN add-apt-repository -y ppa:webupd8team/java
RUN apt-get update
RUN echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get install -y oracle-java7-installer
