---
sidebar_position: 1
---

# 카탈로그 설정값

## Gitea 시스템 카탈로그

Gitea 시스템 카탈로그:

외부 DB 참조조

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

## Argocd 시스템 카탈로그

Argocd 카탈로그:

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

## Gitea

Gitea 일반 카탈로그:

DB 내장장

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
     secretName: keycloak-tls


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

## MLflow

Mlflow 카탈로그:

외부 minio 사용할 때

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
    cert-manager.io/cluster-issuer: "selfsigned-issuer" 
    cert-manager.io/duration: 8760h  
    cert-manager.io/renew-before: 720h

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

newPassword: rancherPassword1!
```

## rancher-monitoring-crd

rancher-monitoring-crd 카탈로그:

```yaml
---
```

## rancher-monitoring

rancher-monitoring 카탈로그:

```yaml
grafana:
  resources:
    requests:
      cpu: 100m
      memory: 100Mi
    limits:
      cpu: 200m
      memory: 200Mi

prometheus:
  prometheusSpec:
    resources:
      requests:
        cpu: 250m
        memory: 100Mi
      limits:
        cpu: 1000m
        memory: 2000Mi
    scrapeInterval: 1m
    evaluationInterval: 1m
    retention:  30d
    retentionSize: 10GB
    storageSpec:
      volumeClaimTemplate:
        spec:
          accessModes:
          - ReadWriteOnce
          resources:
            requests:
              storage: 10Gi
          storageClassName: longhorn
          volumeMode: Filesystem

alertmanager:
  alertmanagerSpec:
    resources:
      requests:
        cpu: 100m
        memory: 100Mi
      limits:
        cpu: 1000m
        memory: 500Mi

rke2ControllerManager:
  enabled: true
rke2Etcd:
  enabled: true
rke2Proxy:
  enabled: true
rke2Scheduler:
  enabled: true
rke2IngressNginx:
  enabled: true
```

## spark-operator

spark-operator 카탈로그:

```yaml
image:
  registry: docker.io
  repository: kubeflow/spark-operator
  tag: "2.0.2"
  
controller:
  workers: 10
  
  logLevel: info
  
  uiService:
    enable: true
  uiIngress:
    enable: true
    urlFormat: "{{ .Name }}.{{ .Domain }}/{{`{{$appNamespace}}`}}/{{`{{$appName}}`}}"

  resources:
    limits:
      cpu: 100m
      memory: 300Mi
    requests:
      cpu: 100m
      memory: 300Mi


  workqueueRateLimiter:
    bucketQPS: 50
    bucketSize: 500
    maxDelay:
      enable: true
      duration: 6h

webhook:
  resources:
    limits:
      cpu: 100m
      memory: 300Mi
    requests:
      cpu: 100m
      memory: 300Mi

spark:
  jobNamespaces: []
```

## qdrant

qdrant 카탈로그:

```yaml
images:
  repository: docker.io/qdrant/qdrant
  tag: v1.12.4

replicaCount: 1

nodeSelector: {}
tolerations: []
resources: {}


persistence:
  accessModes: ["ReadWriteOnce"]
  size: 10Gi
  storageClassName: ""


config:
  log_level: INFO
  cluster:
    enabled: true
    p2p:
      port: 6335
    consensus:
      tick_period_ms: 100


apiKey: false
readOnlyApiKey: false


ingress:
  enabled: true
  annotations:
    cert-manager.io/cluster-issuer: "selfsigned-issuer" 
    cert-manager.io/duration: 8760h  
    cert-manager.io/renew-before: 720h
  hosts:
  - host: {{ .Name }}.{{ .Domain }}
    paths:
    - path: /
      pathType: Prefix
      servicePort: 6333
  tls: 
  -  hosts:
     - {{ .Name }}.{{ .Domain }}
     secretName: {{ .Name }}-tls-secret
```

## langflow-ide

langflow-ide 카탈로그:

```yaml
langflow:
  backend:
    replicaCount: 1
    image:
      repository: langflowai/langflow-backend
      tag: "v1.1.1"
    resources:
      requests:
        cpu: 0.5
        memory: 1Gi
    nodeSelector: {}
    tolerations: []
    backendOnly: true
    env:
      - name: LANGFLOW_PORT
        value: "7860"
      - name: LANGFLOW_LOG_LEVEL
        value: "info"
      - name: LANGFLOW_AUTO_LOGIN
        value: "False"
      - name: LANGFLOW_SUPERUSER
        value: "admin"
      - name: LANGFLOW_SUPERUSER_PASSWORD
        value: "password"
      - name: LANGFLOW_SECRET_KEY
        value: "randomly_generated_secure_key"
      - name: LANGFLOW_NEW_USER_IS_ACTIVE
        value: "False"
    externalDatabase:
      enabled: true
      driver:
        value: "postgresql"
      host:
        value: "{{ .Name }}-ide-postgresql-service"
      port:
        value: "5432"
      database:
        value: "langflow-db"
      user:
        value: "langflow"
      password:
        valueFrom:
          secretKeyRef:
            key: "password"
            name: "{{ .Name }}-ide-postgresql-service"
    sqlite:
      enabled: false
    probe:
      failureThreshold: 3
      periodSeconds: 10
      timeoutSeconds: 5
      initialDelaySeconds: 5
  frontend:
    enabled: true
    replicaCount: 1
    image:
      repository: langflowai/langflow-frontend
      tag: "v1.1.1"
    resources:
      requests:
        cpu: 0.3
        memory: 512Mi
    nodeSelector: {}
    tolerations: []

ingress:
  enabled: true
  annotations:
    cert-manager.io/cluster-issuer: "selfsigned-issuer" 
    cert-manager.io/duration: 8760h  
    cert-manager.io/renew-before: 720h
  hosts:
    - host: {{ .Name }}.{{ .Domain }}
      paths:
        - path: /
          pathType: ImplementationSpecific
          servicePort: 7860
  tls: 
  -  hosts:
     - {{ .Name }}.{{ .Domain }}
     secretName: {{ .Name }}-tls-secret

postgresql:
  enabled: true
  fullnameOverride: "{{ .Name }}-ide-postgresql-service"
  auth:
    username: "langflow"
    password: "langflow-postgres"
    database: "langflow-db"
  primary:
    persistence:
      size: 5Gi
      storageClass: ""
```

## superset

superset 카탈로그:

```yaml
configOverrides: 
  secret: |
    SECRET_KEY = '$SECRET_KEY'
  enable_oauth: |
    from flask_appbuilder.security.manager import (AUTH_DB, AUTH_OAUTH)
    AUTH_TYPE = AUTH_OAUTH
    OAUTH_PROVIDERS = [
        {
            "name": "keycloak",
            "icon": "fa-key",
            "token_key": "access_token",
            "remote_app": {
                "client_id": "$CLIENT_ID",
                "client_secret": "$CLIENT_SECRET",
                "client_kwargs": {
                  "scope": "openid email profile",
                  'verify': False
                },
                'server_metadata_url': '$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/.well-known/openid-configuration',
                'api_base_url': '$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/protocol/'
            }
        }
    ]

    AUTH_ROLE_ADMIN = 'Admin'
    AUTH_ROLE_PUBLIC = 'Public'

    AUTH_USER_REGISTRATION = True

    AUTH_USER_REGISTRATION_ROLE = "Gamma"
    


bootstrapScript: |
  #!/bin/bash
  pip install sqlalchemy-drill psycopg2-binary Authlib


image:
  repository: apachesuperset.docker.scarf.sh/apache/superset
  tag: ~
  pullPolicy: IfNotPresent
resources: {}
nodeSelector: {}
tolerations: []


ingress:
  enabled: true
  annotations: 
    cert-manager.io/cluster-issuer: "selfsigned-issuer" 
    cert-manager.io/duration: 8760h  
    cert-manager.io/renew-before: 720h
  path: /
  pathType: ImplementationSpecific
  hosts:
  - {{ .Name }}.{{ .Domain }}
  tls: 
  -  hosts:
     - {{ .Name }}.{{ .Domain }}
     secretName: {{ .Name }}-tls-secret
  



supersetNode:
  replicas:
    enabled: true
    replicaCount: 1

  connections:
    redis_host: '{{ .Name }}-redis-headless'
    redis_port: "6379"
    redis_user: ""
    redis_cache_db: "1"
    redis_celery_db: "0"
    redis_ssl:
      enabled: false
      ssl_cert_reqs: CERT_NONE
    db_host: '{{ .Name }}-postgresql'
    db_port: "5432"
    db_user: superset
    db_pass: superset
    db_name: superset
  resources: {}


supersetWorker:
  replicas:
    enabled: true
    replicaCount: 1
  resources: {}
  


supersetCeleryBeat:
  enabled: false
  resources: {}

supersetCeleryFlower:
  enabled: false
  replicaCount: 1
  resources: {}

postgresql:
  enabled: true
  auth:
    username: superset
    password: superset
    database: superset
  image:
    registry: docker.io
  primary:
    resources:
      limits: {}
      requests:
        memory: 256Mi
        cpu: 250m
    persistence:
      enabled: true
      storageClass: ""
      size: 8Gi

redis:
  enabled: true
  architecture: standalone
  auth:
    enabled: false    
    password: superset
  image:
    registry: docker.io
  master:
    resources:
      limits: {}
      requests: {}
    persistence:
      enabled: true
      storageClass: ""
      size: 8Gi
```

## ollama

ollama 카탈로그:

```yaml
image:
  repository: ollama/ollama
  tag: 0.5.4

runtimeClassName: nvidia

persistentVolume:
  enabled: true
  size: "30Gi"
  storageClass: longhorn

resources:
  requests:
    memory: 4096Mi
    cpu: 2000m
  limits:
    memory: 8192Mi
    cpu: 4000m

ollama:
  gpu:
    enabled: ture
    type: 'nvidia'
    number: 1

  models:
    pull:
      - mistral
      #- benedict/linkbricks-mistral-nemo-korean:12b
      #- benedict/linkbricks-gemma2-korean:27b
      #- qwen2.5-coder:32b
      #- codeqwen:7b-chat
      # - llama3

ingress:
  enabled: true
  annotations: 
    cert-manager.io/cluster-issuer: "selfsigned-issuer" 
    cert-manager.io/duration: 8760h  
    cert-manager.io/renew-before: 720h
  hosts:
  - host: {{ .Name }}.{{ .Domain }}
    paths:
      - path: /
        pathType: Prefix
  tls: 
    -  hosts:
       - {{ .Name }}.{{ .Domain }}
       secretName: {{ .Name }}-tls-secret
```

## flowise

flowise 카탈로그:

```yaml
image:
  registry: docker.io

persistence:
  enabled: true
  size: 1Gi
  storageClass: longhorn

resources: {}

config:
  username: flowise
  password: flowise

ingress:
  enabled: true
  annotations: 
    cert-manager.io/cluster-issuer: "selfsigned-issuer" 
    cert-manager.io/duration: 8760h  
    cert-manager.io/renew-before: 720h
  hosts:
  - host: {{ .Name }}.{{ .Domain }}
    paths:
      - /
  tls: 
  -  hosts:
     - {{ .Name }}.{{ .Domain }}
     secretName: {{ .Name }}-tls-secret

postgresql:
  enabled: true
  primary:
    persistence:
      enabled: true
      size: 8Gi
      storageClass: ""
```