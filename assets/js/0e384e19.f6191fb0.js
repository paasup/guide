"use strict";(self.webpackChunkpaasup=self.webpackChunkpaasup||[]).push([[3976],{2053:(n,e,s)=>{s.r(e),s.d(e,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"intro","title":"\uce74\ud0c8\ub85c\uadf8 \uc124\uc815\uac12 \uc608\uc81c","description":"Gitea","source":"@site/docs/intro.md","sourceDirName":".","slug":"/intro","permalink":"/guide/docs/intro","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar"}');var r=s(4848),i=s(8453);const o={sidebar_position:1},a="\uce74\ud0c8\ub85c\uadf8 \uc124\uc815\uac12 \uc608\uc81c",l={},c=[{value:"Gitea",id:"gitea",level:2},{value:"Argo CD",id:"argo-cd",level:2},{value:"MLflow\uc640 S3 \uc0ac\uc6a9\ud560 \ub54c",id:"mlflow\uc640-s3-\uc0ac\uc6a9\ud560-\ub54c",level:2},{value:"MLflow\uc640  \ub0b4\ubd80 minio \uc0ac\uc6a9\ud560 \ub54c",id:"mlflow\uc640--\ub0b4\ubd80-minio-\uc0ac\uc6a9\ud560-\ub54c",level:2},{value:"MLflow\uc640 \uc678\ubd80 minio \uc0ac\uc6a9\ud560 \ub54c",id:"mlflow\uc640-\uc678\ubd80-minio-\uc0ac\uc6a9\ud560-\ub54c",level:2}];function x(n){const e={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...n.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(e.header,{children:(0,r.jsx)(e.h1,{id:"\uce74\ud0c8\ub85c\uadf8-\uc124\uc815\uac12-\uc608\uc81c",children:"\uce74\ud0c8\ub85c\uadf8 \uc124\uc815\uac12 \uc608\uc81c"})}),"\n",(0,r.jsx)(e.h2,{id:"gitea",children:"Gitea"}),"\n",(0,r.jsx)(e.p,{children:"Gitea \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,r.jsx)(e.p,{children:"\uc544\ub798 \ud56d\ubaa9\uc740 \uc0ac\uc774\ud2b8\uc5d0 \ub530\ub77c \uc218\uc815\uc774 \ud544\uc694\ud569\ub2c8\ub2e4."}),"\n",(0,r.jsxs)(e.ul,{children:["\n",(0,r.jsx)(e.li,{children:"host"}),"\n",(0,r.jsx)(e.li,{children:"username"}),"\n",(0,r.jsx)(e.li,{children:"password"}),"\n",(0,r.jsx)(e.li,{children:"ROOT_URL"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-yaml",children:'global:\n  imageRegistry: ""\n\ningress:\n  enabled: true\n  annotations:\n    kubernetes.io/ingress.class: nginx\n    nginx.ingress.kubernetes.io/proxy-body-size: 200m\n  hosts:\n    - host: gitea.my.org\n      paths:\n        - path: /\n          pathType: Prefix\n  tls:\n    - hosts:\n        host: gitea.my.org\n      secretName: platform\n\nextraVolumes:\n - name: gitea-tls\n   secret:\n     secretName: platform\n\nextraContainerVolumeMounts:\n  - name: gitea-tls\n    mountPath: /data/gitea/https\n\nlifecycleHooks:\n  postStart:\n    exec:\n      command: ["/bin/sh", "-c", "cp /data/gitea/https/tls.crt /usr/local/share/ca-certificates/; update-ca-certificates"]\n\n\nreplicaCount: 1\n\ntolerations: []\n\nnodeSelector: {}\n\nresources:\n  requests:\n    cpu: 100m\n    memory: 300Mi\n  limits:\n    cpu: 300m\n    memory: 500Mi\n\npersistence:\n  enabled: true\n  size: 10Gi\n  storageClass: ""\n\n\ngitea:\n  admin:   \n    username: sudouser\n    password: xxxxxxxxx\n    email: "sudouser@cro.com"\n  config:\n    APP_NAME: paasup git\n    RUN_MODE: prod\n    server:\n      ROOT_URL: https://gitea.my.org\n    database:\n      DB_TYPE: postgres\n      HOST: postgresql-ha-postgresql:5432\n      NAME: gitea\n      USER: gitea\n      PASSWD: gitea\n      CHARSET: utf8\n      SCHEMA: gitea\n      SSL_MODE: disable\n    session:\n      PROVIDER: postgres\n      PROVIDER_CONFIG: user=gitea password=gitea host=postgresql-ha-postgresql port=5432 dbname=gitea sslmode=disable\n      COOKIE_NAME: i_hate_gitea\n    service:\n      DEFAULT_ALLOW_CREATE_ORGANIZATION: true\n    repository:\n      DEFAULT_BRANCH: master\n'})}),"\n",(0,r.jsx)(e.h2,{id:"argo-cd",children:"Argo CD"}),"\n",(0,r.jsx)(e.p,{children:"Argo CD \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,r.jsx)(e.p,{children:"\uc544\ub798 \ud56d\ubaa9\uc740 \uc0ac\uc774\ud2b8\uc5d0 \ub530\ub77c \uc218\uc815\uc774 \ud544\uc694\ud569\ub2c8\ub2e4."}),"\n",(0,r.jsxs)(e.ul,{children:["\n",(0,r.jsx)(e.li,{children:"hostname"}),"\n",(0,r.jsx)(e.li,{children:"hosts"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-yaml",children:'server:\n  ingress:\n    enabled: true\n    annotations:\n      nginx.ingress.kubernetes.io/rewrite-target: /\n      nginx.ingress.kubernetes.io/force-ssl-redirect: "true"\n      nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"\n    ingressClassName: "nginx"\n    hostname: "argocd.my.org"\n    extraTls:\n      - hosts:\n        - argocd.my.org\n        secretName: platform\n'})}),"\n",(0,r.jsx)(e.h2,{id:"mlflow\uc640-s3-\uc0ac\uc6a9\ud560-\ub54c",children:"MLflow\uc640 S3 \uc0ac\uc6a9\ud560 \ub54c"}),"\n",(0,r.jsx)(e.p,{children:"Mlflow \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,r.jsx)(e.p,{children:"\uc544\ub798 \ud56d\ubaa9\uc740 \uc0ac\uc774\ud2b8\uc5d0 \ub530\ub77c \uc218\uc815\uc774 \ud544\uc694\ud569\ub2c8\ub2e4."}),"\n",(0,r.jsxs)(e.ul,{children:["\n",(0,r.jsx)(e.li,{children:"hostname"}),"\n",(0,r.jsx)(e.li,{children:"hosts"}),"\n",(0,r.jsx)(e.li,{children:"password"}),"\n",(0,r.jsx)(e.li,{children:"externalS3 > host, port, accessKeyID, accessKeySecret"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-yaml",children:'tracking:\n  auth:\n    username: mlflow\n    password: xxxxxxxxx\n  service:\n    type: ClusterIP\n  ingress:\n    enabled: true\n    pathType: ImplementationSpecific\n    hostname: mlflow.my.org\n    ingressClassName: "nginx"\n    annotations:\n      nginx.ingress.kubernetes.io/proxy-body-size: 2048m\n    path: /\n    tls: false\n    extraTls:\n    - hosts:\n        - mlflow.my.org\n      secretName: platform\n  extraArgs:\n    - "--gunicorn-opts=--timeout 600"\npostgresql:\n  auth:\n    username: mlflow\n    password: xxxxxxxx\nminio:\n  enabled: false\nexternalS3:\n  host: "192.168.1.21"\n  port: 9000\n  useCredentialsInSecret: true\n  accessKeyID: "XXXXXXX"\n  accessKeySecret: "xxxxxxxxxxxxxxxxxx"\n  protocol: "http"\n  bucket: "dev-mlflow"\n  serveArtifacts: true\n'})}),"\n",(0,r.jsx)(e.h2,{id:"mlflow\uc640--\ub0b4\ubd80-minio-\uc0ac\uc6a9\ud560-\ub54c",children:"MLflow\uc640  \ub0b4\ubd80 minio \uc0ac\uc6a9\ud560 \ub54c"}),"\n",(0,r.jsx)(e.p,{children:"Mlflow \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,r.jsx)(e.p,{children:"\uc544\ub798 \ud56d\ubaa9\uc740 \uc0ac\uc774\ud2b8\uc5d0 \ub530\ub77c \uc218\uc815\uc774 \ud544\uc694\ud569\ub2c8\ub2e4."}),"\n",(0,r.jsxs)(e.ul,{children:["\n",(0,r.jsx)(e.li,{children:"hostname"}),"\n",(0,r.jsx)(e.li,{children:"hosts"}),"\n",(0,r.jsx)(e.li,{children:"password"}),"\n",(0,r.jsx)(e.li,{children:"minio > rootPassword"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-yaml",children:'tracking:\n  auth:\n    username: mlflow\n    password: xxxxxxxxx\n  service:\n    type: ClusterIP\n  ingress:\n    enabled: true\n    pathType: ImplementationSpecific\n    hostname: mlflow.stg.paasup.io\n    ingressClassName: "nginx"\n    annotations:\n      nginx.ingress.kubernetes.io/proxy-body-size: 2048m\n    path: /\n    tls: false\n    extraTls:\n    - hosts:\n        - mlflow.stg.paasup.io\n      secretName: platform\n  extraArgs:\n    - "--gunicorn-opts=--timeout 600"\npostgresql:\n  auth:\n    username: mlflow\n    password: xxxxxxxx\nminio:\n  enabled: true\n  auth:\n    rootUser: mlflow\n    rootPassword: xxxxxxxx\n'})}),"\n",(0,r.jsx)(e.h2,{id:"mlflow\uc640-\uc678\ubd80-minio-\uc0ac\uc6a9\ud560-\ub54c",children:"MLflow\uc640 \uc678\ubd80 minio \uc0ac\uc6a9\ud560 \ub54c"}),"\n",(0,r.jsx)(e.p,{children:"Mlflow \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,r.jsx)(e.p,{children:"\uc544\ub798 \ud56d\ubaa9\uc740 \uc0ac\uc774\ud2b8\uc5d0 \ub530\ub77c \uc218\uc815\uc774 \ud544\uc694\ud569\ub2c8\ub2e4."}),"\n",(0,r.jsxs)(e.ul,{children:["\n",(0,r.jsx)(e.li,{children:"hostname"}),"\n",(0,r.jsx)(e.li,{children:"hosts"}),"\n",(0,r.jsx)(e.li,{children:"password"}),"\n",(0,r.jsx)(e.li,{children:"minio > host, port, accessKeyID, accessKeySecret"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-yaml",children:'tracking:\n  auth:\n    username: mlflow\n    password: xxxxxxx\n  service:\n    type: ClusterIP\n  ingress:\n    enabled: true\n    pathType: ImplementationSpecific\n    hostname: mlflow.stg.paasup.io\n    ingressClassName: "nginx"\n    annotations:\n      nginx.ingress.kubernetes.io/proxy-body-size: 2048m\n    path: /\n    tls: false\n    extraTls:\n    - hosts:\n        - mlflow.stg.paasup.io\n      secretName: platform\n  extraArgs:\n    - "--gunicorn-opts=--timeout 600"\npostgresql:\n  auth:\n    username: mlflow\n    password: xxxxxxxx\nminio:\n  enabled: false\nexternalS3:\n  host: "minio.stg.paasup.io"\n  port: 443\n  useCredentialsInSecret: true\n  accessKeyID: "xxxxx"\n  accessKeySecret: "XXXXXXXXXX"\n  protocol: "https"\n  bucket: "mlflow"\n  serveArtifacts: true\n'})})]})}function d(n={}){const{wrapper:e}={...(0,i.R)(),...n.components};return e?(0,r.jsx)(e,{...n,children:(0,r.jsx)(x,{...n})}):x(n)}},8453:(n,e,s)=>{s.d(e,{R:()=>o,x:()=>a});var t=s(6540);const r={},i=t.createContext(r);function o(n){const e=t.useContext(i);return t.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function a(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(r):n.components||r:o(n.components),t.createElement(i.Provider,{value:e},n.children)}}}]);