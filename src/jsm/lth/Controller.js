
import {
    Vector3, Quaternion, Matrix4, Euler
} from '../../../build/three.module.js';
import * as TWEEN from '../libs/tween.esm.js'
import { OrbitControls } from '../controls/OrbitControls.js';
import { math } from './math.js';


/**
 * @author lo.th / https://github.com/lo-th
 */

export class Controller extends OrbitControls {

    constructor( object, domElement, group ) {

        super( object, domElement );

    	this.followTarget = null;
        this.camTween = [];

        this.isDecal = false;
        this.isInDecal = false;

        this.tmpP =  new Vector3();
        this.tmpQ = new Quaternion();

    	this.cam = {

    		stiffness: 0.15,
    		stiffnessTarget: 1,

    	    theta:180,
            phi:20,
            distance:10,
            maxDistance:10,
    	    height:0.6,

    	    v: new Vector3(),
            d: new Vector3(),

            tmp: new Vector3(),
            oldp: new Vector3(),
            oldq: new Quaternion(),
            offset: new Vector3(),
            position: new Vector3(),
            decal: new Vector3(),

            multy:1,

            clipper: true,

            forceFree:false,

            simple:false,

            //pov:null,
            

    	}

        this.reverse = false;

    	this.followGroup = group;

        this.tmpMatrix = new Matrix4();
        this.tmpE = new Euler();
        this.tmpV = new Vector3();

        this.info = this.getInfo();

        this.isFree = true;

        this.rayClipper = null;

        this.tmpV1 = new Vector3();

    }

    upExtra (z){

        this.cam.distance *= z

    }

    startFollow ( mesh, o ) {

        if(o.d !== undefined) o.distance = o.d;
        if(o.h !== undefined) o.theta = o.h;
        if(o.v !== undefined) o.phi = o.v;

        let cam = this.cam;

        cam.simple = o.simple !== undefined ? o.simple : false;

        cam.stiffness = o.stiffness !== undefined ? o.stiffness : 0.15;
        cam.stiffnessTarget = o.stiffnessTarget !== undefined ? o.stiffnessTarget : 1;

        cam.height = o.height !== undefined ? o.height : 0.6;
        cam.d.set(0,this.cam.height,0);

        cam.theta = o.theta !== undefined ? o.theta : 180;
        cam.phi = o.phi !== undefined ? o.phi : 20;
        cam.distance = o.distance !== undefined ? o.distance : 10;
        cam.maxDistance = cam.distance;
        cam.rotation = o.rotation !== undefined ? o.rotation : true;
        cam.offset.set( 0,0,0 );
        cam.decal.fromArray( o.decal !== undefined ? o.decal : [0,0,0] );
        if( o.dx !== undefined ) cam.decal.x = o.dx;
        if( o.dy !== undefined ) cam.decal.y = o.dy;
        if( o.dz !== undefined ) cam.decal.z = o.dz;
        cam.clipper = o.clipper || false;
        cam.exr = o.exr || 0;


        cam.forceFree = o.forceFree || false;

        if( o.direct ){
            this.initFollow( mesh, o );
            return;
        }

        //cam.pov = o.pov || null;


        let start = this.getTargetStart( mesh );

        o.target = start.p;
        o.theta = math.unwrapDeg( o.theta + start.r );

        var callback2 = o.callback;

        o.callback = function() {

            if(callback2) callback2();
            this.initFollow( mesh, o );

        }.bind( this );

        this.moveCam( o );

    }

    getTargetStart ( mesh ){

        mesh.updateMatrix();
        this.tmpMatrix.makeRotationFromQuaternion( mesh.quaternion );
        let cam = this.cam;
        let r = Math.atan2( this.tmpMatrix.elements[8], this.tmpMatrix.elements[10] ) ;
        if( cam.decal.x !== 0 || cam.decal.z !== 0 ) cam.offset.copy( cam.position ).add( cam.decal ).applyAxisAngle( { x:0, y:1, z:0 }, r );
        let p = cam.tmp.copy( mesh.position ).add( cam.offset ).add( cam.d ).toArray();
        
        return { p:p, r:r * math.todeg }

    }

    initFollow ( mesh, o ) {

        o = o || {};

        this.cam.oldp.copy( mesh.position );
        this.cam.oldq.copy( mesh.quaternion );

        this.stopMoveCam();

        /*if( this.cam.clipper ){

            this.rayClipper = root.add( { name: 'cameraRayClipper', type:'ray', callback: (o) => { this.onRayClipper(o) }, visible:false, group: "all", filter: [o.clipperFilter || (-1 >>> 0)], isIntern:true } );

        }*/

        this.followTarget = mesh;

    }

    onRayClipper ( o ) {

        if( o.hit ) this.cam.distance = math.clamp( o.distance, this.minDistance, this.cam.maxDistance );
        else {
            if( this.cam.distance < this.cam.maxDistance ){
                this.cam.distance += this.cam.maxDistance/16;
            }
        }
        
        this.maxDistance = this.cam.distance;

    }


    resetAll () {
		
		this.stopMoveCam();
        this.resetFov();
        this.resetFollow();
        this.setLimite();
        this.reverse = false;

    }

    setLimite ( o ){

        o = o || {};

        this.minPolarAngle = o.minV !== undefined ? (90-o.minV) * math.torad : 0;
        this.maxPolarAngle = o.maxV !== undefined ? (90-o.maxV) * math.torad : Math.PI;

        this.minAzimuthAngle = o.minH !== undefined ? o.minH * math.torad : - Infinity;
        this.maxAzimuthAngle = o.maxH !== undefined ? o.maxH * math.torad : Infinity;

        this.minDistance = o.minD !== undefined ? o.minD : 0.01;
        this.maxDistance = o.maxD !== undefined ? o.maxD : Infinity;

    }

    resetFov () {

        this.object.fov = 50;
        this.object.zoom = 1;
        this.object.updateProjectionMatrix();

    }

	resetFollow () {

        this.followGroup.position.set(0,0,0);
		this.followTarget = null;
        this.enabled = true;


        /*if( this.rayClipper !== null ){ 
            root.remove( 'cameraRayClipper' );
            this.rayClipper = null;
        }*/
	}

    /*upPosition:function () {

        if( !this.followTarget ) return;

        this.tmpP.copy(this.followTarget.position );
        this.tmpQ.copy(this.followTarget.quaternion ) ;

        //this.tmpP.lerp(this.followTarget.position, 0.5 );
        //this.tmpQ.slerp(this.followTarget.quaternion, 0.5 ) ;

    },*/

	follow ( delta ) {

        if( !this.followTarget ) return;



        var cam = this.cam;
        var camera = this.object;
        var target = this.target;
        var sph = this.getSpherical();
        var state = this.getState();


        this.tmpP.copy( this.followTarget.position );
        this.tmpQ.copy( this.followTarget.quaternion );


        if(cam.simple){

            target.copy( this.tmpP )
            camera.position.setFromSpherical( sph ).add( target );
            camera.lookAt( target );
            this.updateFollowGroup();

            return;

        }



        


        //if( this.isDecal || this.isInDecal ){

           // cam.oldp.copy( this.tmpP );
           // cam.oldq.copy( this.tmpQ );

            /*var yy = camera.position.y;
            camera.position.sub( cam.oldp );
            camera.position.y = yy;
            this.target.copy( this.tmpP ).add( cam.d );
            camera.lookAt( this.target ); */

        //}


        this.isFree =false;
        

        var p = this.tmpP;
		var q = this.tmpQ;

        this.tmpMatrix.makeRotationFromQuaternion( q );
        var tRotation = Math.atan2( this.tmpMatrix.elements[8], this.tmpMatrix.elements[10] );

       

        var dist = p.distanceTo( cam.oldp );

        var qx = q.x - cam.oldq.x;
        var qy = q.y - cam.oldq.y;
        var qz = q.z - cam.oldq.z;
        var qw = q.w - cam.oldq.w;
        var qdist = Math.sqrt(qx * qx + qy * qy + qz * qz + qw * qw);

        var theta = ( cam.theta * math.torad ) + tRotation;
        var phi = ( ( 90 - cam.phi ) * math.torad ) ;
        var radius = cam.distance;




        if( this.enabled ){
            if( state === 0 || state === 3 || (dist < 0.01 && qdist < 0.001) ) this.isFree = true;
            else if( !cam.forceFree ) sph.set( radius, phi, theta );
        } else {
            sph.set( radius, phi, theta );
        }



        //if( cam.decal.x !== 0 || cam.decal.z !== 0 ) 
        //cam.offset.copy( cam.position ).add( cam.decal ).applyAxisAngle( { x:0, y:1, z:0 }, tRotation );


        //this.tmpE.set( 0, tRotation, 0, 'XYZ' ) 
        this.tmpV.copy( cam.decal ).applyAxisAngle( { x:1, y:0, z:0 }, phi - math.PI90 )
        cam.offset.copy( cam.position ).add( this.tmpV ).applyAxisAngle( { x:0, y:1, z:0 }, tRotation );
       

        cam.v.copy( p ).add( cam.offset ).add( cam.d );
        cam.tmp.setFromSpherical( sph ).add( cam.v );

        //camera.position.copy( cam.tmp );

        if( this.reverse ){

            if( cam.stiffnessTarget !== 1 ) camera.position.lerp( cam.v, cam.stiffnessTarget );
            else camera.position.copy( cam.v );

            if( !this.isDecal ) target.lerp( cam.tmp, cam.stiffness );
            else target.copy( cam.tmp );

        } else {

            if( !this.isDecal ) camera.position.lerp( cam.tmp, cam.stiffness );
            else camera.position.copy( cam.tmp );

            if( cam.stiffnessTarget !== 1 ) target.lerp( cam.v, cam.stiffnessTarget );
            else target.copy( cam.v );

        }
        

       // if( cam.rotation ) camera.lookAt( target );
        camera.lookAt( target );

        this.updateFollowGroup();

        cam.oldp.copy( p );
		cam.oldq.copy( q );


        if( this.isInDecal ){ this.isDecal = false; this.isInDecal = false; }
        if( this.isDecal ) this.isInDecal = true;


        if( !this.cam.clipper ) return;

        this.rayClipper.start.copy( p ).add( cam.offset).add( cam.d );
        this.tmpV1.set(0, 0, -1).applyQuaternion( camera.quaternion ).normalize().multiplyScalar( cam.maxDistance );
        this.rayClipper.end.copy(this.rayClipper.start).sub( this.tmpV1 );

    }


    updateFollowGroup(){

        this.followGroup.position.set( this.target.x, 0, this.target.z );

    }

    getInfo () {

        this.update();

        var t = this.target;
        var c = this.object;
        var sph = this.getSpherical();

        return {

            x:t.x, y:t.y, z:t.z,

            //distance: Math.floor( c.position.distanceTo( t ) ),
            //phi: -Math.floor( this.getPolarAngle() * math.todeg ) + 90,
            //theta: Math.floor( this.getAzimuthalAngle() * math.todeg ),

            distance: sph.radius,
            phi: math.unwrapDeg(-Math.floor( sph.phi * math.todeg ) + 90),
            theta: math.unwrapDeg(Math.floor( sph.theta * math.todeg )),

            fov: c.fov,
            zoom: c.zoom,

        };


    }

    stopMoveCam (){

        var i = this.camTween.length;
        while(i--){
            TWEEN.remove( this.camTween[i] );
            this.camTween[i] = null;
        }

        this.camTween = [];
        this.info = this.getInfo();

    }

    moveCam ( data ) {

        if( this.followTarget ) this.resetFollow();

    	var self = this;
        this.info = this.getInfo();

        data = data || {};

        var o = {};

        if( data.phi !== undefined ) o.phi = data.phi;
        if( data.theta !== undefined ) o.theta = data.theta;
        if( data.distance !== undefined ) o.distance = data.distance;

        if( data.v !== undefined ) o.phi = data.v;
        if( data.h !== undefined ) o.theta = data.h;
        if( data.d !== undefined ) o.distance = data.d;

        if( data.fov !== undefined ) o.fov = data.fov;
        if( data.zoom !== undefined ) o.zoom = data.zoom;

        if( data.target ){
            o.x = data.target[0];
            o.y = data.target[1];
            o.z = data.target[2];
        }

        var shortest = data.shortest !== undefined ? data.shortest : true;
		
		if( o.theta !== undefined && shortest ){ // get shortest distance
			var prvh = this.getSpherical().theta * math.todeg;
			o.theta = prvh + math.angleDistance(o.theta, prvh);
		}
		
        var time = data.time !== undefined ? data.time : 0;
        var tween = data.tween !== undefined ? data.tween : TWEEN.Easing.Quadratic.Out;//Easing.Linear.None;
        var delay = data.delay !== undefined ? data.delay : 0;

        this.enabled = false;

        var c = [];
        for( var n in o ) c[n] = this.info[n];

		var callback = data.callback || function(){};

        if( time === 0 ){

            for( var n in o ) c[n] = o[n];
            this.stopMoveCam();
            this.orbit( c );
            this.enabled = true;
            callback();
            return;

        }


        var t = new TWEEN.Tween( c )
            .to( o, time )
            .delay( delay )
            .easing( tween )
            .onUpdate( function( o ) { self.orbit( o ); } )
            .onComplete( function() { self.enabled = true;  callback(); } )
            .start();

        this.camTween.push( t );

    }

    zommer ( p, time, callback ) {

        this.stopMoveCam();

        var cam = this.cam;
        var camera = this.object;
        var o = { 
            zoom:p.zoom, fov:p.fov, distance:p.distance,
            dx: p.dx !== undefined ? p.dx : cam.decal.x, 
            dy: p.dy !== undefined ? p.dy : cam.decal.y, 
            dz: p.dz !== undefined ? p.dz : cam.decal.z, 
            exr: p.exr !== undefined ? p.exr : cam.exr, 
            multy: p.multy !== undefined ? p.multy : cam.multy, 
        };


        var t = new TWEEN.Tween( { zoom:camera.zoom, fov:camera.fov, distance:cam.distance, dx:cam.decal.x, dy:cam.decal.y, dz:cam.decal.z, exr:cam.exr, multy:cam.multy } )
            .to( o, time || 300 )
            .onUpdate( function( o ) { 
                camera.fov = o.fov;
                camera.zoom = o.zoom;
                cam.distance = o.distance;
                cam.decal.x = o.dx; 
                cam.decal.y = o.dy; 
                cam.decal.z = o.dz;
                cam.exr = o.exr;
                cam.multy = o.multy;
                camera.updateProjectionMatrix();
            })
            .onComplete( function( ) {
                if( callback ) callback();
            }
            ).start();

        this.camTween.push( t );

    }

    orbit ( c ) {

        var o = this.info;
        for( var n in c ) o[n] = c[n];

    	var camera = this.object;
        var target = this.target;
        var sph = this.getSpherical();

        var upCam = false;
        if( camera.fov !== o.fov ){ camera.fov = o.fov; upCam = true; }
        if( camera.zoom !== o.zoom ){ camera.zoom = o.zoom; upCam = true; }
        if( upCam ) camera.updateProjectionMatrix();

        sph.set( o.distance, (-o.phi+90) * math.torad, o.theta * math.torad );
        sph.makeSafe();

        if( this.reverse ){
            //target.set( o.x, o.y, o.z );
            camera.position.set( o.x, o.y, o.z );
            target.setFromSpherical( sph ).add( camera.position );
            camera.lookAt( target );
        } else {
            target.set( o.x, o.y, o.z );
            //camera.position.set( 0,0,0 ).setFromSpherical( sph ).add( target );
            camera.position.setFromSpherical( sph ).add( target );
            camera.lookAt( target );
        }

        //this.updateFollowGroup();

    }

    getDirection () {

        return math.tmpV.subVectors( this.target, this.object.position ).normalize().toArray();//math.directionVector( this.object.position, this.target );

    }



}