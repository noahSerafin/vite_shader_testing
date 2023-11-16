import { useState } from 'react'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import React, { useEffect } from "react";
import './App.css'
import vs from './shaders/vs.glsl'
import fs from './shaders/fs.glsl'
import simVertex from './shaders/simVertex.glsl'
import simFragment from './shaders/simFragment.glsl'
//import polska from './assets/polskacrop.jpg'

function App() {
  useEffect(() => { 
    const canvas = document.querySelector('.webgl');
  
    // Scene
    const scene = new THREE.Scene()

    //Feedback Object
    const getRenderTarget = () =>{
      const renderTarget = new THREE.WebGLRenderTarget( this.width, this.height, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      });
      return renderTarget
    }

    const fboScene = new THREE.Scene()
    const fboCamera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);

    const setupFBO = () => {
      const size = 128
      let fbo = getRenderTarget()
      let fbo1 = getRenderTarget()

      fboCamera.lookat(0,0,0);
      let fbgeometry = new THREE.PlaneGeometry(2,2);

      const data = new Float32Array(this.size * this.size * 4);

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          let index = (i + j * size) * 4;
          let theta = Math.random() * Math.PI * 2
          let r = 0.5 + 0.5*Math.random()
          data[index + 0] = r*Math.cos(theta);
          data[index + 1] = r*Math.sin(theta);
          data[index + 2] = 1.;
          data[index + 3] = 1.;

        }
      }
      const fboTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
      fboTexture.magFilter = THREE.NearestFilter
      fboTexture.minFilter = THREE.NearestFilter
      fboTexture.needsUpdate = true;

      const fboMaterial = new THREE.ShaderMaterial({
        vertexShader: simVertex,
        fragmentShader: simFragment,
        uniforms: {
          uPositions: {
           value: null
          },
          uTime: {
            value: 0
          },
        }
      })

      const fbmesh = new THREE.Mesh(fbgeometry, fboTexture)
      fboScene.add(fbmesh)

    }
    setupFBO();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    
    /**
     * Test mesh
     */
    // Geometry
    const geometry = new THREE.PlaneGeometry(1.5, 1, 32, 32)

    //spikes-----------
    const count = geometry.attributes.position.count
    const randoms = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random()
    }
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    console.log(geometry.attributes)
    //---------------
    
    //texture
    const flagTexture = textureLoader.load('src/assets/polskacrop.jpg')
    //-----

    // Material
    const shaderMaterial = new THREE.RawShaderMaterial({
      vertexShader: vs,
      fragmentShader: fs,
      wireframe: true,
      side: THREE.DoubleSide,
      //tansparent: true //to use alpha
      uniforms: {
        uFrequency: {
          value: new THREE.Vector2(10, 5)
        },
        uTime: {
          value: 0
        },
        uColor: {
          value: new THREE.Color('orange')
        },
        uTexture: { value: flagTexture }
      }
    })
    //gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name(freqX)
    //gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name(freqY)

    const material = new THREE.MeshBasicMaterial({
      color: '#828282'
    })
    
    // Mesh
    //const mesh = new THREE.Mesh(geometry, material)
    const mesh = new THREE.Mesh(geometry, shaderMaterial)

    scene.add(mesh)
    
    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    
        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
    
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    
    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0.25, - 0.25, 1)
    scene.add(camera)
    
    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    
    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    /**
     * Animate
     */
    const clock = new THREE.Clock()
    
    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()
        //console.log(elapsedTime)
        shaderMaterial.uniforms.uTime.value = elapsedTime
        // Update controls
        controls.update()
    
        // Render
        //renderer.render(scene, camera)
        renderer.setRenderTarget(null);
        renderer.render(fboScene, fboCamera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
    
    tick()
  })

  return (
    <div className="background" id="background">
      <canvas id="webglCanvas" className="webgl"></canvas>
    </div>
  );
}

export default App
