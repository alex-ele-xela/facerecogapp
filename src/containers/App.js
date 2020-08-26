import React from 'react';
import Particles from "react-tsparticles";
import Clarifai from 'clarifai';
import SignIn from '../components/SignIn/SignIn';
import Register from '../components/Register/Register';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import Rank from '../components/Rank/Rank';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import FaceRecog from '../components/FaceRecog/FaceRecog';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'dbf47653e1bc4179b9564a3739661ea8'
})

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box : {},
      route : 'signin',
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    const img = document.getElementById('inputImage');
    const width = Number(img.width);
    const height = Number(img.height);

    return {
      leftCol : clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row * height,
      rightCol : width - (clarifaiFace.right_col * width),
      bottomRow : height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box : box})
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => {
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    this.setState({route : route, imageUrl : '', input : ''})
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          id="tsparticles"
          options={{
            fpsLimit: 60,
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 6,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  value_area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                random: true,
                value: 5,
              },
            },
            detectRetina: true,
          }}
        />

        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.route === 'home'}/>

        { this.state.route === 'home' 
          ? <>
              <Logo />

              <Rank />

              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit} />

              <FaceRecog box={this.state.box} imageUrl={this.state.imageUrl} />
            </>

          : (this.state.route === 'signin'
             ?  <SignIn onRouteChange={this.onRouteChange}/> 

             : <Register onRouteChange={this.onRouteChange}/> 
          )
        }
      </div>
    );
  }
}

export default App;
