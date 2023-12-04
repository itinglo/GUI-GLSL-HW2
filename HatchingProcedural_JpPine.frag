// Author:CMH
// Title: 20231007_Textile_v3.qtz 
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0; //Ourimage

//GUI controls
uniform float u_SmoothStepMin;
uniform float u_SmoothStepMax;
uniform float u_BrushStroke;
uniform float u_noiseX;
uniform float u_noiseY;


vec2 hash2( vec2 x )           //亂數範圍 [0,1]
{
    const vec2 k = vec2( 0.1, 0.5 );
    x = x*k;
    return fract( 20.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}
float gnoise( in vec2 p )       //亂數範圍 [0,1]
{
    vec2 i = ( p ); //ceil也一樣
    vec2 f = fract( p );   
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( dot( hash2( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( hash2( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( hash2( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( hash2( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

//hatching
float texh(in vec2 p, in float str)
{
    float breathing=(exp(sin(u_time/6.0*3.14159)) - 0.36787944)*0.42545906412;
    float rz= 1.0;
    int j=50;
    
    for (int i=0 ; i < 50 ; i++){
        float pas=float(i)/float(j);
        float g = gnoise(vec2(u_noiseX, u_noiseY)*p); //亂數範圍 [0,1]
        g=smoothstep(u_SmoothStepMin, u_SmoothStepMax, g);
        
        float stride = 4.* u_BrushStroke; //must be multiplier by 4
        p.xy = mod(p.x + vec2(p.y,-p.y), vec2(stride)); //mod就是斜的 x - y * floor(x/y)
        if(i/2==0) p.xy = p.yx;
        //p += 0.07;

        if ( 1.0-pas < str) break; 
        p*= 1.5;
        rz = min(1.- g * 0.85,rz);
          
    }
    return rz;
}


void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;
    
    //detail scale up
    /*
    uv*=0.6;
    uv.y+=0.15;
    */
    float breathing=(exp(sin(u_time/6.0*3.14159)) - 0.36787944)*0.42545906412;

    float info=texture2D(u_tex0,uv).g;
    vec3 col=vec3(texh(uv*0.5, info+0.25)); //-breathing*0.3
    gl_FragColor = vec4(col, 1.0);
}



