<jittershader name="default">
	<description> Default shader </description>
	
	<param name="noiseTex"  type="int"   default="0" />
	<param name="freq"      type="float" default="2.0" />
	<param name="freqRed"   type="float" default="2.0" />
	<param name="freqGreen" type="float" default="1.2" />
	<param name="freqBlue"  type="float" default="4.9" />
	
	<language name="glsl" version="1.2">	
	
		<bind param="noiseTex" program="vp" />
		<bind param="freq"     program="vp" />
		<bind param="freqRed"     program="vp" />
		<bind param="freqGreen"   program="vp" />
		<bind param="freqBlue"    program="vp" />
	
		<program name="vp" type="vertex">
<![CDATA[

uniform sampler2D noiseTex;
uniform float freq;

uniform float freqRed;
uniform float freqGreen;
uniform float freqBlue;

void main (void)
{	
	vec2 texcoord = vec2(gl_TextureMatrix[0] * gl_MultiTexCoord0);
	texcoord *= vec2(freq);

	vec4 noise = texture2D(noiseTex, texcoord);
	vec4 eyePos = gl_ModelViewMatrix * gl_Vertex;
	
	vec3 normal = normalize(gl_NormalMatrix * gl_Normal);
	
	vec4 newPos = eyePos + (vec4(normal, 1.0) * noise);
	
    gl_Position = gl_ProjectionMatrix * newPos;
	
	
/*	vec4 color1 = vec4(0.5, 0.0, 0.0, 1.0);
	vec4 color2 = vec4(0.0, 0.4, 2.0, 1.0);
	gl_FrontColor = mix(color2, color1, noise);
*/	
	gl_FrontColor = vec4(abs(cos(noise.x*freqRed)), abs(sin(noise.x*freqGreen)), abs(cos((noise.x*freqBlue)+1000.0)), 1.0);
	//gl_FrontColor = vec4(freqRed), freqGreen, freqBlue)+1000.0)), 1.0);
	//gl_FrontColor = vec4(noise*noise);//blackAndWhite
	
}
]]>		
		</program>
		<program name="fp" type="fragment">
<![CDATA[
void main()
{	
	gl_FragColor = gl_Color;
} 
]]>
		</program>
	</language>
</jittershader>
