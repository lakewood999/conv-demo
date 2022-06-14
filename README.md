# Convolution Operation Demos
This website provides a couple of demonstrations that can be used to understand the convolution operation in the context of image processing. The first demo is the application of filter/kernel matrices (i.e. Sobel filter) onto images, and the second demo is a convolutional neural network trained on the classic MNIST digit dataset where users can draw and classify numbers.

## Running
Build a Docker container using the provided Dockerfile and run with the compose file.

ALTERNATIVELY:
It is possible to run this website in a standalone fashion. This is not recommended and untested, but the main website can be run using `poetry install` (with the Poetry dependency manager) and run using `poetry run gunicorn --bind host:port main:app`. The Tensorflow Serve container can be run using Docker as described [here](https://www.tensorflow.org/tfx/serving/docker). In this setup, I recommend you run this as a system service for convenience (e.g. using a `systemd` unit) and using a reverse proxy such as `apache2`, `nginx`, or `caddy` in front of the `gunicorn` server for better control. Again, this method is untested and it would be significantly easier to use the compose file.

**DEMO: I am hosting this site (deployed via the Dockerfile/compose method) at [convdemo.stevensu.dev](https://convdemo.stevensu.dev)**

## License
The code written by me in the repository is licensed under the AGPL v3 license, the text of which is included. Content by other parties (e.g. Bootstrap, images, etc.) retain their original licenses and permissions. 

## Note
The [Github](https://github.com/lakewood999/conv-demo) repository currently (automatically) mirrors that on my personal [Gitlab](https://git.stevensu.dev/lakewood999/conv-demo). This may change in the future, but for the present, the Gitlab is the guiding repo. 
