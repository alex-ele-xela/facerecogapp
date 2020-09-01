import React from 'react';
import Particles from "react-tsparticles";
import SignIn from '../components/SignIn/SignIn';
import Register from '../components/Register/Register';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import Rank from '../components/Rank/Rank';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import FaceRecog from '../components/FaceRecog/FaceRecog';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  box : {},
  route : 'signin',
  user : {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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

    fetch('https://hidden-gorge-63963.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input : this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://hidden-gorge-63963.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id : this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries : count}))
            })
            .catch(console.log)
        }
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

              <Rank name={this.state.user.name} entries={this.state.user.entries}/>

              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit} />

              <FaceRecog box={this.state.box} imageUrl={this.state.imageUrl} />
            </>

          : (this.state.route === 'signin'
             ?  <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 

             : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 
          )
        }
      </div>
    );
  }
}

export default App;
