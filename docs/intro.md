---
sidebar_position: 1
---

# 카탈로그 설정값 예제

## Gitea DB 외부 참조

Gitea 시스템 카탈로그:

아래 항목은 사이트에 따라 수정이 필요합니다.

- password 

```yaml
global:
  imageRegistry: ""

ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-body-size: 200m
    cert-manager.io/cluster-issuer: "selfsigned-issuer" 
    cert-manager.io/duration: 8760h  
    cert-manager.io/renew-before: 720h
  hosts:
    - host: {{ .Name }}.{{ .Domain }}
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        host: {{ .Name }}.{{ .Domain }}
      secretName: {{ .Name }}-tls-secret

extraVolumes:
 - name: gitea-tls
   secret:
     secretName: {{ .Name }}-tls-secret

extraContainerVolumeMounts:
  - name: gitea-tls
    mountPath: /data/gitea/https

lifecycleHooks:
  postStart:
    exec:
      command: ["/bin/sh", "-c", "cp /data/gitea/https/tls.crt /usr/local/share/ca-certificates/; update-ca-certificates"]


replicaCount: 1

tolerations: []

nodeSelector: {}

resources:
  requests:
    cpu: 100m
    memory: 300Mi
  limits:
    cpu: 300m
    memory: 500Mi

persistence:
  enabled: true
  size: 10Gi
  storageClass: ""


gitea:
  admin:   
    username: sudouser
    password: password
    email: "sudouser@paasup.io"
  config:
    APP_NAME: paasup git
    RUN_MODE: prod
    server:
      ROOT_URL: https://{{ .Name }}.{{ .Domain }}
    database:
      DB_TYPE: postgres
      HOST: postgresql-ha-postgresql:5432
      NAME: gitea
      USER: gitea
      PASSWD: gitea
      CHARSET: utf8
      SCHEMA: gitea
      SSL_MODE: disable
    session:
      PROVIDER: postgres
      PROVIDER_CONFIG: user=gitea password=gitea host={{ .Name }}-postgresql port=5432 dbname=gitea sslmode=disable
      COOKIE_NAME: i_hate_gitea
    service:
      DEFAULT_ALLOW_CREATE_ORGANIZATION: true
    repository:
      DEFAULT_BRANCH: master
```

## Gitea DB 포함

Gitea 일반 카탈로그:

아래 항목은 사이트에 따라 수정이 필요합니다.

- password 

```yaml
global:
  imageRegistry: ""

ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-body-size: 200m
    cert-manager.io/cluster-issuer: "selfsigned-issuer" 
    cert-manager.io/duration: 8760h  
    cert-manager.io/renew-before: 720h
  hosts:
    - host: {{ .Name }}.{{ .Domain }}
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        host: {{ .Name }}.{{ .Domain }}
      secretName: {{ .Name }}-tls-secret

extraVolumes:
 - name: gitea-tls
   secret:
     secretName: {{ .Name }}-tls-secret

extraContainerVolumeMounts:
  - name: gitea-tls
    mountPath: /data/gitea/https

lifecycleHooks:
  postStart:
    exec:
      command: ["/bin/sh", "-c", "cp /data/gitea/https/tls.crt /usr/local/share/ca-certificates/; update-ca-certificates"]


replicaCount: 1

tolerations: []

nodeSelector: {}

resources:
  requests:
    cpu: 100m
    memory: 300Mi
  limits:
    cpu: 300m
    memory: 500Mi

persistence:
  enabled: true
  size: 10Gi
  storageClass: ""

postgresql:
  enabled: true

gitea:
  admin:   
    username: sudouser
    password: password
    email: "sudouser@paasup.io"
  config:
    APP_NAME: paasup git
    RUN_MODE: prod
    server:
      ROOT_URL: https://{{ .Name }}.{{ .Domain }}
    database:
      DB_TYPE: postgres
      HOST: {{ .Name }}-postgresql:5432
      NAME: gitea
      USER: gitea
      PASSWD: gitea
      CHARSET: utf8
      SCHEMA: public
      SSL_MODE: disable
    session:
      PROVIDER: postgres
      PROVIDER_CONFIG: user=gitea password=gitea host={{ .Name }}-postgresql port=5432 dbname=gitea sslmode=disable
      COOKIE_NAME: i_hate_gitea
    service:
      DEFAULT_ALLOW_CREATE_ORGANIZATION: true
    repository:
      DEFAULT_BRANCH: master
```

## Argo CD

Argo CD 카탈로그:

아래 항목은 사이트에 따라 수정이 필요합니다.

- hostname
- hosts

```yaml
server:
  ingress:
    enabled: true
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /
      nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
      nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
    ingressClassName: "nginx"
    hostname: "argocd.my.org"
    extraTls:
      - hosts:
        - argocd.my.org
        secretName: platform
```

## MLflow와 S3 사용할 때

Mlflow 카탈로그:

아래 항목은 사이트에 따라 수정이 필요합니다.

- hostname
- hosts
- password
- externalS3 > host, port, accessKeyID, accessKeySecret

```yaml
tracking:
  auth:
    username: mlflow
    password: xxxxxxxxx
  service:
    type: ClusterIP
  ingress:
    enabled: true
    pathType: ImplementationSpecific
    hostname: mlflow.my.org
    ingressClassName: "nginx"
    annotations:
      nginx.ingress.kubernetes.io/proxy-body-size: 2048m
    path: /
    tls: false
    extraTls:
    - hosts:
        - mlflow.my.org
      secretName: platform
  extraArgs:
    - "--gunicorn-opts=--timeout 600"
postgresql:
  auth:
    username: mlflow
    password: xxxxxxxx
minio:
  enabled: false
externalS3:
  host: "192.168.1.21"
  port: 9000
  useCredentialsInSecret: true
  accessKeyID: "XXXXXXX"
  accessKeySecret: "xxxxxxxxxxxxxxxxxx"
  protocol: "http"
  bucket: "dev-mlflow"
  serveArtifacts: true
```

## MLflow와  내부 minio 사용할 때

Mlflow 카탈로그:

아래 항목은 사이트에 따라 수정이 필요합니다.

- hostname
- hosts
- password
- minio > rootPassword

```yaml
tracking:
  auth:
    username: mlflow
    password: xxxxxxxxx
  service:
    type: ClusterIP
  ingress:
    enabled: true
    pathType: ImplementationSpecific
    hostname: mlflow.stg.paasup.io
    ingressClassName: "nginx"
    annotations:
      nginx.ingress.kubernetes.io/proxy-body-size: 2048m
    path: /
    tls: false
    extraTls:
    - hosts:
        - mlflow.stg.paasup.io
      secretName: platform
  extraArgs:
    - "--gunicorn-opts=--timeout 600"
postgresql:
  auth:
    username: mlflow
    password: xxxxxxxx
minio:
  enabled: true
  auth:
    rootUser: mlflow
    rootPassword: xxxxxxxx
```

## MLflow와 외부 minio 사용할 때

Mlflow 카탈로그:

아래 항목은 사이트에 따라 수정이 필요합니다.

- hostname
- hosts
- password
- minio > host, port, accessKeyID, accessKeySecret

```yaml
tracking:
  auth:
    username: mlflow
    password: xxxxxxx
  service:
    type: ClusterIP
  ingress:
    enabled: true
    pathType: ImplementationSpecific
    hostname: mlflow.stg.paasup.io
    ingressClassName: "nginx"
    annotations:
      nginx.ingress.kubernetes.io/proxy-body-size: 2048m
    path: /
    tls: false
    extraTls:
    - hosts:
        - mlflow.stg.paasup.io
      secretName: platform
  extraArgs:
    - "--gunicorn-opts=--timeout 600"
postgresql:
  auth:
    username: mlflow
    password: xxxxxxxx
minio:
  enabled: false
externalS3:
  host: "minio.stg.paasup.io"
  port: 443
  useCredentialsInSecret: true
  accessKeyID: "xxxxx"
  accessKeySecret: "XXXXXXXXXX"
  protocol: "https"
  bucket: "mlflow"
  serveArtifacts: true
```