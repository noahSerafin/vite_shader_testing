precision mediump float;
uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main(){
    
   vec4 textureColor = texture2D(uTexture, vUv);
   textureColor.rgb *= vElevation + 1.0;

   gl_FragColor = textureColor;
   //gl_FragColor = vec4(uColor, 1.0);
   //gl_FragColor = vec4(0.4297, 0.832, 0.8359, 1.0);

}