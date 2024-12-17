---
sidebar_position: 1
---

# 카탈로그 설정값

## Gitea 시스템 카탈로그 (DB 외부 참조)

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
    - host: gitea.{{ .Domain }}
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        host: gitea.{{ .Domain }}
      secretName: platform

extraVolumes:
 - name: gitea-tls
   secret:
     secretName: platform

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
    email: "sudouser@cro.com"
  config:
    APP_NAME: paasup git
    RUN_MODE: prod
    server:
      ROOT_URL: https://gitea.{{ .Domain }}
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
      PROVIDER_CONFIG: user=gitea password=gitea host=postgresql-ha-postgresql port=5432 dbname=gitea sslmode=disable
      COOKIE_NAME: i_hate_gitea
    service:
      DEFAULT_ALLOW_CREATE_ORGANIZATION: true
    repository:
      DEFAULT_BRANCH: master
```

## Gitea 카탈로그 (DB 내장)

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
 - name: keycloak-tls
   secret:
     secretName: keycloak-tls-secret


extraContainerVolumeMounts:
  - name: keycloak-tls
    mountPath: /etc/ssl/certs/ca.crt
    subPath: ca.crt

lifecycleHooks:
  postStart:
    exec:
      command: 
      - "/bin/sh"
      -  "-c"
      - |
        POST_START

replicaCount: 1

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
  storageClass: "longhorn"

gitea:
  admin:   
    username: sudouser
    password: password
    email: "sudouser@cro.com"
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
      SSL_MODE: disable
    service:
      DEFAULT_ALLOW_CREATE_ORGANIZATION: true
    repository:
      DEFAULT_BRANCH: master

postgresql:
  enabled: true
  global:
    postgresql:
      postgresqlDatabase: gitea
      postgresqlUsername: gitea
      postgresqlPassword: gitea
      servicePort: 5432
  persistence:
    size: 5Gi
```

## Argo CD 시스템 카탈로그

Argo CD 카탈로그:

```yaml
server:
  ingress:
    enabled: true
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /
      nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
      nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
    ingressClassName: "nginx"
    hostname: "argocd.{{ .Domain }}"
    extraTls:
      - hosts:
        - argocd.{{ .Domain }}
        secretName: platform
```

## MLflow와 외부 minio 사용할 때

Mlflow 카탈로그:

아래 항목은 사이트에 따라 수정이 필요합니다.

- password

```yaml
tracking:
  auth:
    username: mlflow
    password: password
  service:
    type: ClusterIP
  ingress:
    enabled: true
    pathType: ImplementationSpecific
    hostname: {{ .Name }}.{{ .Domain }}
    ingressClassName: "nginx"
    annotations:
      nginx.ingress.kubernetes.io/proxy-body-size: 2048m
      cert-manager.io/cluster-issuer: "selfsigned-issuer" 
      cert-manager.io/duration: 8760h  
      cert-manager.io/renew-before: 720h
    path: /
    tls: false
    extraTls:
    - hosts:
        - {{ .Name }}.{{ .Domain }}
      secretName: {{ .Name }}-tls-secret
  extraArgs:
    - "--gunicorn-opts=--timeout 600"
postgresql:
  auth:
    username: mlflow
    password: mlflow
minio:
  enabled: false
externalS3:
  host: "minio.stg.paasup.io"
  port: 443
  useCredentialsInSecret: true
  accessKeyID: "{{ .AccessKey }}"
  accessKeySecret: "{{ .SecretKey }}"
  protocol: "https"
  bucket: "{{ .Path }}"
  serveArtifacts: true
```

## Kubeflow

Kubeflow 카탈로그:

```yaml
apiVersion: kubeflow.org/v1
kind: Profile
metadata:
  name: {{ .Namespace }}
spec:
  owner:
    kind: User
    name: {{ .Email }}
  resourceQuotaSpec:
    hard:
      cpu: "4"
      memory: 2Gi
      persistentvolumeclaims: "4"
```

## Rancher

Rancher 카탈로그:

```yaml
hostname: {{ .Name }}.{{ .Domain }}
ingress:
  enable: true
  tls:
    source: secret
    secretName: rancher-tls-ingress
  extraAnnotations:    
    nginx.ingress.kubernetes.io/proxy-body-size: 10m

privateCA: true

replicas: 1

tolerations: []

nodeSelector: {}

resources: 
  requests:
    cpu: 100m
    memory: 500Mi
  limits:
    cpu: 1000m
    memory: 1000Mi

extraEnv:
- name: TZ
  value: Asia/Seoul

preinstallHook: true
```