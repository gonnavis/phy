const t=new Map,e={world:null,delta:0,substep:1,flow:{tmp:[],key:[]},reflow:{ray:[],stat:{fps:0,delta:0}}},s=Math.PI/180;class o{static clear(){t.clear()}static byName(e){return t.has(e)?t.get(e):null}static add(s){if("ray"!==s.type&&"contact"!==s.type)switch(s.type){case"joint":e.world.addConstraint(s,!s.collision);break;case"solid":e.world.addCollisionObject(s,s.group,s.mask);break;default:e.world.addRigidBody(s,s.group,s.mask)}t.set(s.name,s)}static remove(s){if("ray"!==s.type&&"contact"!==s.type){switch(s.type){case"joint":e.world.removeConstraint(s),Ammo.destroy(s.formA),Ammo.destroy(s.formB);break;case"solid":e.world.removeCollisionObject(s);break;default:e.world.removeRigidBody(s)}Ammo.destroy(s)}t.delete(s.name)}static getConvexVolume(t){let e,s=t.length/3,o=[t[0],t[1],t[2]],i=[t[0],t[1],t[2]];for(;s--;)e=3*s,t[e]<o[0]?o[0]=t[e]:t[e]>i[0]&&(i[0]=t[e]),t[e+1]<o[1]?o[1]=t[e+1]:t[e+1]>i[1]&&(i[1]=t[e+1]),t[e+2]<o[2]?o[2]=t[e+2]:t[e+2]>i[2]&&(i[2]=t[e+2]);return(i[0]-o[0])*(i[1]-o[1])*(i[2]-o[2])}static stats(){}static extends(){Ammo.btVector3.prototype.set=function(t,e,s){return this.setValue(t,e,s),this},Ammo.btVector3.prototype.toArray=function(t,e){let s=void 0!==t;if(s||(t=[]),t[e=e||0]=this.x(),t[e+1]=this.y(),t[e+2]=this.z(),!s)return t},Ammo.btVector3.prototype.fromArray=function(t,e){return e=e||0,this.setValue(t[e],t[e+1],t[e+2]),this},Ammo.btVector3.prototype.copy=function(t){return this.setValue(t.x(),t.y(),t.z()),this},Ammo.btVector3.prototype.mul=function(){return this.x()*this.y()*this.z()},Ammo.btVector3.prototype.multiplyScalar=function(t){return this.setValue(this.x()*t,this.y()*t,this.z()*t),this},Ammo.btVector3.prototype.divideScalar=function(t){return this.multiplyScalar(1/t)},Ammo.btVector3.prototype.applyMatrix3=function(t){const e=this.x(),s=this.y(),o=this.z(),i=[];return t.getRow(0).toArray(i,0),t.getRow(1).toArray(i,3),t.getRow(2).toArray(i,6),this.setValue(i[0]*e+i[3]*s+i[6]*o,i[1]*e+i[4]*s+i[7]*o,i[2]*e+i[5]*s+i[8]*o),this},Ammo.btQuaternion.prototype.set=function(t,e,s,o){return this.setValue(t,e,s,o),this},Ammo.btQuaternion.prototype.toArray=function(t,e){let s=void 0!==t;if(s||(t=[]),t[e=e||0]=this.x(),t[e+1]=this.y(),t[e+2]=this.z(),t[e+3]=this.w(),!s)return t},Ammo.btQuaternion.prototype.fromArray=function(t,e){return e=e||0,this.setValue(t[e],t[e+1],t[e+2],t[e+3]),this},Ammo.btQuaternion.prototype.fromAxisAngle=function(t,e){var s=.5*e,o=Math.sin(s);return this.setValue(t[0]*o,t[1]*o,t[2]*o,Math.cos(s)),this},Ammo.btQuaternion.prototype.fromAxis=function(t){let e=t.toArray();if(e[2]>.99999)this.setValue(0,0,0,1);else if(e[2]<-.99999)this.setValue(1,0,0,0);else{let t=[e[1],e[0],0],s=Math.acos(e[2]);this.fromAxisAngle(t,s)}return this},Ammo.btTransform.prototype.set=function(t,e){return this.setOrigin(t),this.setRotation(e),this},Ammo.btTransform.prototype.identity=function(){return this.setIdentity(),this},Ammo.btTransform.prototype.fromArray=function(t,e,s,o){let i=this.getOrigin();i.fromArray(t||[0,0,0],s||0),this.setOrigin(i);let r=this.getRotation();return r.fromArray(e||[0,0,0,1],o||0),this.setRotation(r),this},Ammo.btTransform.prototype.toArray=function(t,e){e=e||0,this.getOrigin().toArray(t,e),this.getRotation().toArray(t,e+3)},Ammo.btTransform.prototype.getPos=function(){return this.getOrigin().toArray()},Ammo.btTransform.prototype.getQuat=function(){return this.getRotation().toArray()},Ammo.btTransform.prototype.copy=function(t){return this.op_set(t),this},Ammo.btTransform.prototype.rotationFromAxis=function(t){let e=this.getRotation();return e.fromAxis(t),this.setRotation(e),this}}}class i{constructor(){this.id=0,this.list=[],this.type="item",this.Utils=null}reset(){let t=this.list.length;for(;t--;)this.dispose(this.list[t]);this.id=0,this.list=[]}byName(t){return this.Utils.byName(t)}setName(t={}){let e=void 0!==t.name?t.name:this.type+this.id++;return t.id=this.remove(e,!0),e}addToWorld(t,e=-1){this.Utils.add(t),-1!==e?this.list[e]=t:this.list.push(t)}remove(t,e){let s=this.byName(t);return s?this.clear(s,e):-1}clear(t,e){let s=this.list.indexOf(t);return-1===s||e?this.list[s]=null:this.list.splice(s,1),this.dispose(t),s}dispose(t){null!==t&&this.Utils.remove(t)}add(t={}){}set(t={}){}step(t,e){}}class r extends i{constructor(){super(),this.Utils=o,this.type="body",this.v=new Ammo.btVector3,this.vv=new Ammo.btVector3,this.q=new Ammo.btQuaternion,this.t=new Ammo.btTransform,this.v1=new Ammo.btVector3,this.v2=new Ammo.btVector3,this.v3=new Ammo.btVector3}step(t,e){let s,o,i,r=this.list.length;for(;r--;)s=this.list[r],o=e+8*r,s?(i=2===s.getMotionState(),t[o]=i?0:9.8*s.getLinearVelocity().length(),s.getMotionState().getWorldTransform(this.t),this.t.toArray(t,o+1)):t[o]=t[o+1]=t[o+2]=t[o+3]=t[o+4]=t[o+5]=t[o+6]=t[o+7]=0}shape(t={}){let e,s,i,r=t.type||"box",a=t.size||[1,1,1],n=1;switch(r){case"plane":e=new Ammo.btStaticPlaneShape(this.v.fromArray(t.dir||[0,1,0]),0);break;case"box":e=new Ammo.btBoxShape(this.v.set(.5*a[0],.5*a[1],.5*a[2])),n=8*this.v.mul();break;case"sphere":e=new Ammo.btSphereShape(a[0]),n=4*Math.PI*a[0]*a[0]*a[0]/3;break;case"cone":e=new Ammo.btConeShape(a[0],a[1]),n=Math.PI*a[0]*(.5*a[1])*2;break;case"cylinder":e=new Ammo.btCylinderShape(this.v.set(a[0],.5*a[1],a[0])),n=Math.PI*a[0]*a[0]*(.5*a[1])*2;break;case"capsule":e=new Ammo.btCapsuleShape(a[0],a[1]),n=4*Math.PI*a[0]*a[0]*a[0]/3+Math.PI*a[0]*a[0]*(.5*a[1])*2;break;case"convex":let r=void 0===t.optimize||t.optimize;for(e=new Ammo.btConvexHullShape,s=Math.floor(t.v.length/3);s--;)i=3*s,e.addPoint(this.v.fromArray(t.v,i),!0);r&&(e.optimizeConvexHull(),e.recalcLocalAabb(),e.initializePolyhedralFeatures(1)),n=o.getConvexVolume(t.v);break;case"mesh":let l=new Ammo.btTriangleMesh,m=!1,h=t.v,c=t.index||null,d=h.length;if(null!==c){for(d=h.length,s=0;s<d;s+=3)l.findOrAddVertex(this.v.set(h[s],h[s+1],h[s+2]),!1);for(d=c.length,s=0;s<d;s+=3)l.addTriangleIndices(c[s],c[s+1],c[s+2])}else for(s=0;s<d;s+=9)l.addTriangle(this.v1.set(h[s+0],h[s+1],h[s+2]),this.v2.set(h[s+3],h[s+4],h[s+5]),this.v3.set(h[s+6],h[s+7],h[s+8]),m);"solid"===this.type?(e=new Ammo.btBvhTriangleMeshShape(l,!0,!0),n=1):(e=new Ammo.btConvexTriangleMeshShape(l,!0),n=o.getConvexVolume(t.v))}return e.setMargin&&e.setMargin(t.margin||1e-4),e.volume=n,e}add(t={}){let e=this.setName(t),s=void 0!==t.flag?t.flag:"solid"===this.type?1:0,o=void 0!==t.group?t.group:"solid"===this.type?2:1,i=void 0!==t.mask?t.mask:-1;t.kinematic&&(s=2,o=4);let r=null;switch(t.type){case"null":i=0,r=this.shape({type:"sphere",size:[.01]});break;case"compound":let e,s;r=new Ammo.btCompoundShape,r.volume=0;for(var a=0;a<t.shapes.length;a++)e=t.shapes[a],this.t.fromArray(e.pos,e.quat),s=this.shape(e),r.volume+=s.volume,r.addChildShape(this.t,s);break;default:r=this.shape(t)}this.t.fromArray(t.pos,t.quat),this.v.set(0,0,0);let n=(t.density||0)*r.volume;0!==n&&r.calculateLocalInertia(n,this.v);let l=new Ammo.btDefaultMotionState(this.t),m=new Ammo.btRigidBodyConstructionInfo(n,l,r,this.v),h=new Ammo.btRigidBody(m);h.setCollisionFlags(s),Ammo.destroy(m),h.name=e,h.type=this.type,h.isKinematic=t.kinematic||!1,h.isGhost=!1,h.group=o,h.mask=i,h.first=!0,delete t.pos,delete t.quat,this.set(t,h),this.addToWorld(h,t.id)}set(t={},s=null){null===s&&(s=this.byName(t.name)),null!==s&&(void 0!==t.flag&&(s.setCollisionFlags(t.flag),s.isKinematic=2===t.flag),t.noGravity&&s.setGravity(this.v.fromArray([0,0,0])),(t.pos||t.quat)&&(t.pos&&t.quat||s.getMotionState().getWorldTransform(this.t),t.pos||(t.pos=this.t.getPos()),t.quat||(t.quat=this.t.getQuat()),this.t.fromArray(t.pos,t.quat),s.isKinematic?s.getMotionState().setWorldTransform(this.t):s.setWorldTransform(this.t)),void 0!==t.state&&s.setActivationState(t.state),(t.activate||t.wake)&&s.activate(),t.neverSleep&&(s.setSleepingThresholds(0,0),s.setActivationState(4)),t.sleep&&s.setActivationState(2),void 0!==t.friction&&s.setFriction(t.friction),void 0!==t.restitution&&s.setRestitution(t.restitution),void 0!==t.rollingFriction&&s.setRollingFriction(t.rollingFriction),t.reset&&(s.setLinearVelocity(this.v.set(0,0,0)),s.setAngularVelocity(this.v.set(0,0,0))),s.isGhost||(void 0!==t.group&&(s.getBroadphaseProxy().set_m_collisionFilterGroup(t.group),s.group=t.group),void 0!==t.mask&&(s.getBroadphaseProxy().set_m_collisionFilterMask(t.mask),s.mask=t.mask),void 0!==t.damping&&s.setDamping(t.damping[0],t.damping[1]),void 0!==t.sleeping&&s.setSleepingThresholds(t.sleeping[0],t.sleeping[1])),void 0!==t.linearVelocity&&s.setLinearVelocity(this.v.fromArray(t.linearVelocity)),void 0!==t.angularVelocity&&s.setAngularVelocity(this.v.fromArray(t.angularVelocity)),void 0!==t.linearFactor&&s.setLinearFactor(this.v.fromArray(t.linearFactor)),void 0!==t.angularFactor&&s.setAngularFactor(this.v.fromArray(t.angularFactor)),void 0!==t.anisotropic&&s.setAnisotropicFriction(t.anisotropic[0],t.anisotropic[1]),void 0!==t.massProps&&s.setMassProps(t.massProps[0],t.massProps[1]),void 0!==t.ccdThreshold&&s.setCcdMotionThreshold(t.ccdThreshold),void 0!==t.ccdRadius&&s.setCcdSweptSphereRadius(t.ccdRadius),void 0!==t.gravity&&s.setGravity(this.v.fromArray(t.gravity)),t.worldForce&&s.applyForce(this.v.fromArray(t.worldForce),this.v.fromArray(t.worldForce,3)),t.force&&s.applyForce(this.v.fromArray(t.force).divideScalar(e.substep)),t.torque&&s.applyTorque(this.v.fromArray(t.torque).divideScalar(e.substep)),t.linearImpulse&&(t.impulseCentral=t.linearImpulse),t.impulseCentral&&s.applyCentralImpulse(this.v.fromArray(t.impulseCentral)),t.impulse&&s.applyImpulse(this.v.fromArray(t.impulse),this.v.fromArray(t.impulse,3)))}}class a extends r{constructor(){super(),this.type="solid"}step(t,e){}}class n extends i{constructor(){super(),this.Utils=o,this.type="joint",this.t=new Ammo.btTransform,this.t1=new Ammo.btTransform,this.t2=new Ammo.btTransform,this.v1=new Ammo.btVector3,this.v2=new Ammo.btVector3,this.p1=new Ammo.btVector3,this.p2=new Ammo.btVector3,this.q1=new Ammo.btQuaternion,this.q2=new Ammo.btQuaternion}step(t,e){let s,o,i=this.list.length;for(;i--;)s=this.list[i],o=e+16*i,s.visible&&(this.t.copy(s.getRigidBodyA().getWorldTransform()).op_mul(s.formA).toArray(t,o),this.t.copy(s.getRigidBodyB().getWorldTransform()).op_mul(s.formB).toArray(t,o+7))}add(t={}){this.v;let e=this.setName(t);const s=this.byName(t.b1),o=this.byName(t.b2);let i=this.v1.fromArray(t.pos1||[0,0,0]),r=this.v2.fromArray(t.pos2||[0,0,0]),a=this.q1.fromArray(t.quat1||[0,0,0,1]),n=this.q2.fromArray(t.quat2||[0,0,0,1]),l=this.p1.fromArray(t.axis1||[0,0,1]),m=this.p2.fromArray(t.axis2||[0,0,1]);t.quat1||a.fromAxis(l),t.quat2||n.fromAxis(m),this.t1.identity(),this.t2.identity();const h=t.useA||!1;(t.worldAnchor||t.worldAxis)&&(s&&(s.activate(),s.getMotionState().getWorldTransform(this.t1)),o&&(o.activate(),o.getMotionState().getWorldTransform(this.t2))),t.worldAnchor&&(i=this.v1.fromArray(t.worldAnchor).op_sub(this.t1.getOrigin()),r=this.v2.fromArray(t.worldAnchor).op_sub(this.t2.getOrigin()),i.applyMatrix3(this.t1.getBasis()),r.applyMatrix3(this.t2.getBasis())),t.worldAxis&&(l=this.p1.fromArray(t.worldAxis),m=this.p2.fromArray(t.worldAxis),l.applyMatrix3(this.t1.getBasis()),m.applyMatrix3(this.t2.getBasis()),a.fromAxis(l),n.fromAxis(m));const c=(new Ammo.btTransform).set(i,a),d=(new Ammo.btTransform).set(r,n);let p,u=t.mode||"revolute";switch("d6"===u&&(u="dof"),"slider"===u&&(u="prismatic"),"joint_p2p"===u&&(u="spherical"),"conetwist"===u&&(u="ragdoll"),u){case"spherical":p=new Ammo.btPoint2PointConstraint(s,o,i,r),t.strength&&p.get_m_setting().set_m_tau(t.strength),t.damping&&p.get_m_setting().set_m_damping(t.damping),t.impulse&&p.get_m_setting().set_m_impulseClamp(t.impulse);break;case"hinge2":p=new Ammo.btHinge2Constraint(s,o,i,l,m);break;case"hinge":case"revolute":p=new Ammo.btHingeConstraint(s,o,c,d,h);break;case"prismatic":p=new Ammo.btSliderConstraint(s,o,c,d,h);break;case"ragdoll":p=new Ammo.btConeTwistConstraint(s,o,c,d);break;case"dof":p=new Ammo.btGeneric6DofSpringConstraint(s,o,c,d,h),p.setAngularLowerLimit(this.v1.fromArray([0,0,0])),p.setAngularUpperLimit(this.v1.fromArray([0,0,0]));break;case"fixe":p=new Ammo.btFixedConstraint(s,o,c,d);break;case"gear":p=new Ammo.btGearConstraint(s,o,l,m,t.ratio||1)}p.name=e,p.mode=u,p.type=this.type,p.formA=c,p.formB=d,p.visible=void 0===t.visible||t.visible,p.collision=t.collision||!1,this.set(t,p),this.addToWorld(p,t.id)}set(t={},e=null){if(null===e&&(e=this.byName(t.name)),null===e)return;let o,i,r,a;t.breaking&&e.setBreakingImpulseThreshold&&e.setBreakingImpulseThreshold(t.breaking),t.iteration&&e.setOverrideNumSolverIterations&&e.setOverrideNumSolverIterations(t.iteration);const n=["x","y","z","rx","ry","rz"];switch(e.mode){case"prismatic":break;case"hinge":case"revolute":t.lm&&e.setLimit(t.lm[0]*s,t.lm[1]*s,t.lm[2]||.9,t.lm[3]||.3,t.lm[4]||1),t.motor&&e.enableAngularMotor(!0,t.motor[0]*s,t.motor[1]);break;case"dof":case"sdof":if(t.motor)for(o=t.motor.length;o--;)i=t.motor[o],"rx"===i[0]&&(r=e.getRotationalLimitMotor(0)),"ry"===i[0]&&(r=e.getRotationalLimitMotor(1)),"rz"===i[0]&&(r=e.getRotationalLimitMotor(2)),r&&(r.set_m_enableMotor(!0),r.set_m_targetVelocity(-i[1]*s),r.set_m_maxMotorForce(i[2]));if(t.lm){for(r=[[0,0,0],[0,0,0],[0,0,0],[0,0,0]],o=t.lm.length;o--;)i=t.lm[o],"rx"===i[0]&&(r[0][0]=i[1]*s,r[1][0]=i[2]*s),"ry"===i[0]&&(r[0][1]=i[1]*s,r[1][1]=i[2]*s),"rz"===i[0]&&(r[0][2]=i[1]*s,r[1][2]=i[2]*s),"x"===i[0]&&(r[2][0]=i[1],r[3][0]=i[2]),"y"===i[0]&&(r[2][1]=i[1],r[3][1]=i[2]),"z"===i[0]&&(r[2][2]=i[1],r[3][2]=i[2]);e.setAngularLowerLimit(this.v1.fromArray(r[0])),e.setAngularUpperLimit(this.v1.fromArray(r[1])),e.setLinearLowerLimit(this.v1.fromArray(r[2])),e.setLinearUpperLimit(this.v1.fromArray(r[3]))}if(t.sd)for(o=t.sd.length;o--;)i=t.sd[o],a=n.indexOf(i[0]),console.log(e),e.setStiffness(a,i[1]),e.setDamping(a,i[2]),e.enableSpring(a,!0),i[3]&&e.setEquilibriumPoint(a)}}}class l extends i{constructor(){super(),this.Utils=o,this.type="ray",this.callback=new Ammo.ClosestRayResultCallback}step(t,s){e.reflow.ray=[];let o,i,r,a=this.list.length,n=this.callback;for(;a--;)i=s+8*a,o=this.list[a],t[i]=0,n.set_m_collisionObject(null),n.get_m_rayFromWorld().fromArray(t,i+1),n.get_m_rayToWorld().fromArray(t,i+4),n.set_m_collisionFilterGroup(o.group),n.set_m_collisionFilterMask(o.mask),n.set_m_closestHitFraction(o.precision),e.world.rayTest(n.get_m_rayFromWorld(),n.get_m_rayToWorld(),n),n.hasHit()&&(t[i]=1,n.get_m_hitPointWorld().toArray(t,i+1),n.get_m_hitNormalWorld().toArray(t,i+4),r=Ammo.castObject(n.get_m_collisionObject(),Ammo.btRigidBody).name,void 0===r&&(r=Ammo.castObject(ray.get_m_collisionObject(),Ammo.btSoftBody).name),e.reflow.ray[a]=r)}add(t={}){this.setName(t);let e=new m(t);this.addToWorld(e,t.id)}set(t={},e=null){}}class m{constructor(t={}){this.type="ray",this.name=t.name,this.precision=t.precision||1,this.group=void 0!==t.group||1,this.mask=void 0!==t.mask||-1}}class h extends i{constructor(){super(),this.Utils=o,this.type="contact",this.cb=new Ammo.ConcreteContactResultCallback}step(t,s){let o,i,r,a=this.list.length;for(;a--;)r=0,o=this.list[a],i=s+8*a,this.cb.addSingleResult=function(){r=1},null!==o.b2?e.world.contactPairTest(o.b1,o.b2,this.cb):e.world.contactTest(o.b1,this.cb),t[i]=r}add(t={}){this.setName(t),t.b1=this.byName(t.b1),t.b2=this.byName(t.b2);let e=new c(t);this.addToWorld(e,t.id)}}class c{constructor(t={}){this.type="contact",this.name=t.name,this.b1=t.b1||null,this.b2=t.b2||null,this.ignore=t.ignore||[],this.result={hit:!1,point:[0,0,0],normal:[0,0,0],distance:0}}update(){}}self.onmessage=function(t){E.message(t)};let d,p,u,y,f,A,b,g,v,w,k=!1,x=!0,_=!1;const S="undefined"==typeof performance?Date:performance,T={tmp:0,n:0,dt:0,fps:0};let C,V,M,R,F,B,I,P,W=1/60,q=4,N=!0,L=2,O=0,z=0,j=null,D=null,U=null,G=null,Q=[],H=[],K=[];class E{static test(){}static message(t){let s=t.data;s.Ar&&(d=s.Ar),s.flow&&(e.flow=s.flow),E[s.m](s.o)}static post(t,e){f?self.postMessage(t,e):y({data:t})}static init(t={}){f=!0,_=t.isBuffer||!1,p=t.ArPos,u=t.ArMax,void 0!==t.fps&&(W=1/t.fps),void 0!==t.substep&&(q=t.substep),t.returnMessage&&(y=t.returnMessage,f=!1,_=!1),t.blob&&importScripts(t.blob),Ammo().then((function(t){o.extends(),E.initItems(),E.post({m:"ready",o:{}})}))}static initItems(){A=new r,b=new a,g=new n,v=new l,w=new h}static set(t={}){k=t.isTimeout||!1,W=1/(t.fps||60),q=t.substep||1,N=void 0===t.fixe||t.fixe,L=t.broadphase||2,e.substep=q,x=void 0===t.soft||t.soft,U=(new Ammo.btVector3).fromArray(t.gravity||[0,-9.8,0]),t.penetration&&(G=t.penetration),null===e.world&&E.start()}static start(){null===e.world&&(d=new Float32Array(u),this.makeWorld()),C=!1,V=!1,z=0,M=0,k?E.step():j=setInterval(E.step,1e3*W)}static makeWorld(){switch(R=new Ammo.btSequentialImpulseConstraintSolver,F=x?new Ammo.btDefaultSoftBodySolver:null,B=x?new Ammo.btSoftBodyRigidBodyCollisionConfiguration:new Ammo.btDefaultCollisionConfiguration,I=new Ammo.btCollisionDispatcher(B),L){case 1:let t=1e3;P=new Ammo.btAxisSweep3(new Ammo.btVector3(-t,-t,-t),new Ammo.btVector3(t,t,t),4096);break;case 2:P=new Ammo.btDbvtBroadphase}(e.world=x?new Ammo.btSoftRigidDynamicsWorld(I,P,R,B,F):new Ammo.btDiscreteDynamicsWorld(I,P,R,B),e.world.setGravity(U),x)&&e.world.getWorldInfo().set_m_gravity(U);G&&e.world.getDispatchInfo().set_m_allowedCcdPenetration(G)}static add(t={}){switch(t.type||"box"){case"contact":w.add(t);break;case"ray":v.add(t);break;case"joint":g.add(t);break;default:t.density||t.kinematic?A.add(t):b.add(t)}}static remove(t={}){let e=this.byName(t.name);if(null!==e)switch(e.type){case"contact":e=w.clear(e);break;case"ray":e=v.clear(e);break;case"joint":e=g.clear(e);break;case"solid":e=b.clear(e);break;case"body":e=A.clear(e)}}static change(t={}){let e=this.byName(t.name);if(null!==e)switch(e.type){case"ray":e=v.set(t,e);break;case"joint":e=g.set(t,e);break;case"solid":e=b.set(t,e);break;case"body":e=A.set(t,e)}}static dispatch(){for(H=e.flow.remove,Q=e.flow.add,K=e.flow.tmp;H.length>0;)this.remove(H.shift());for(;Q.length>0;)this.add(Q.shift());for(;K.length>0;)this.change(K.shift());e.flow={key:[],add:[],remove:[],tmp:[]}}static poststep(){if(!C&&(M=1,this.dispatch(),k)){let t=1e3*W-(S.now()-O);t<0?E.step():D=setTimeout(E.step,t)}}static step(){V?E.endReset():C||2===M||(M=2,O=S.now(),e.delta=.001*(O-z),z=O,N&&e.world.stepSimulation(W,q,W/q),E.stepItems(),O-1e3>T.tmp&&(T.tmp=O,e.reflow.stat.fps=T.n,T.n=0),T.n++,e.reflow.stat.delta=e.delta,_?E.post({m:"step",reflow:e.reflow,Ar:d},[d.buffer]):E.post({m:"step",reflow:e.reflow,Ar:d}))}static stepItems(){A.step(d,p.body),g.step(d,p.joint),v.step(d,p.ray),w.step(d,p.contact)}static byName(t){return o.byName(t)}static reset(){V=!0}static endReset(){E.stop(),A.reset(),b.reset(),g.reset(),v.reset(),w.reset(),Ammo.destroy(e.world),Ammo.destroy(R),x&&Ammo.destroy(F),Ammo.destroy(B),Ammo.destroy(I),Ammo.destroy(P),e.world=null,o.clear(),E.post({m:"resetCallback",o:{}})}static stop(){C=!0,D&&clearTimeout(D),j&&clearInterval(j),j=null,D=null}static pause(){C?this.start():this.stop()}}export{E as engine};
