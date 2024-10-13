// Function to start the camera and display the video feed
function startCamera() {
    // Request access to the camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const videoElement = document.getElementById('video');
        videoElement.srcObject = stream;  // Attach the stream to the video element
      })
      .catch(err => {
        console.error('Error accessing webcam:', err);
      });
  }
  
  // Function that initializes OpenCV and starts video processing
  function onOpenCvReady() {
    startCamera();  // Start the camera when OpenCV is ready
  
    let faceCascade = new cv.CascadeClassifier();
    let eyeCascade = new cv.CascadeClassifier();
  
    // Load pre-trained models for face and eye detection
    faceCascade.load('haarcascade_frontalface_default.xml');
    eyeCascade.load('haarcascade_eye.xml');
  
    const FPS = 30;
    const video = document.getElementById('video');
    const cap = new cv.VideoCapture(video);
    const src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    const gray = new cv.Mat();
  
    function processVideo() {
      let begin = Date.now();
  
      // Read frame from the camera
      cap.read(src);
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  
      // Detect faces
      let faces = new cv.RectVector();
      faceCascade.detectMultiScale(gray, faces);
  
      let eyesDetected = false;
  
      for (let i = 0; i < faces.size(); ++i) {
        let face = faces.get(i);
        let faceROI = gray.roi(face);
  
        // Detect eyes in the face region
        let eyes = new cv.RectVector();
        eyeCascade.detectMultiScale(faceROI, eyes);
  
        if (eyes.size() > 0) {
          eyesDetected = true;
        }
      }
  
      // Trigger inattentiveness event if no eyes are detected for a certain period
      if (eyesDetected) {
        lastDetectionTime = Date.now();  // Reset timer if eyes are detected
      } else if (Date.now() - lastDetectionTime > 10000) {
        chrome.runtime.sendMessage({ action: 'inattentive' });
      }
  
      // Schedule the next frame processing
      let delay = 1000 / FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
    }
  
    // Start processing the video after OpenCV is ready
    setTimeout(processVideo, 0);
  }
  
