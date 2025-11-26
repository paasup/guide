---
sidebar_position: 1
---

# 카탈로그 설정값

<!-- ## Gitea 시스템 카탈로그 -->

<!-- Gitea 시스템 카탈로그:

외부 DB 참조

아래 항목은 사이트에 따라 수정이 필요합니다.

- password

```yaml
global:
  imageRegistry: ""

ingress:
  enabled: true
  annotations:
    konghq.com/protocols: https
    konghq.com/https-redirect-status-code: "301"
    cert-manager.io/cluster-issuer: "root-ca-issuer"
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
      HOST: postgresql-postgresql-ha-postgresql:5432
      NAME: gitea
      USER: gitea
      PASSWD: gitea
      CHARSET: utf8
      SCHEMA: gitea
      SSL_MODE: disable
    session:
      PROVIDER: postgres
      PROVIDER_CONFIG: user=gitea password=gitea host=postgresql-postgresql-ha-postgresql port=5432 dbname=gitea sslmode=disable
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
      konghq.com/https-redirect-status-code: "301"
      konghq.com/preserve-host: "true"
      konghq.com/protocols: https
    hostname: "argocd.{{ .Domain }}"
    extraTls:
      - hosts:
        - argocd.{{ .Domain }}
        secretName: argocd-tls

  service:
    annotations:
      konghq.com/protocol: https
``` -->

## gitea/6.0.3-2

Gitea 일반 카탈로그:

DB 내장

```yaml
global:
  imageRegistry: ""

ingress:
  enabled: true
  annotations:
    konghq.com/protocols: https
    konghq.com/https-redirect-status-code: "301"
    cert-manager.io/cluster-issuer: "root-ca-issuer" 
    cert-manager.io/duration: 8760h  
    cert-manager.io/renew-before: 720h
  hosts:
    - host: "{{ .Name }}.{{ .Domain }}"
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        host: "{{ .Name }}.{{ .Domain }}"
      secretName: "{{ .Name }}-tls-secret"

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
    password: ""
    email: "gitea@local.domain"
    existingSecret: "$INFISICAL_SECRET"
  config:
    APP_NAME: paasup git
    RUN_MODE: prod
    server:
      ROOT_URL: "https://{{ .Name }}.{{ .Domain }}"
    database:
      DB_TYPE: postgres
      HOST: "{{ .Name }}-postgresql:5432"
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

쿼터
```yaml
# small
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 1000m
    memory: 2Gi
persistence:
  size: 10Gi
  storageClass: "longhorn"

postgresql:
  persistence:
    size: 5Gi
  resources:
    requests:
      cpu: 250m
      memory: 512Mi
    limits:
      cpu: 500m
      memory: 1Gi

# medium
resources:
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 2000m
    memory: 4Gi
persistence:
  size: 100Gi
  storageClass: "longhorn"

postgresql:
  persistence:
    size: 20Gi
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi

# large
resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi
persistence:
  size: 500Gi
  storageClass: "longhorn"

postgresql:
  persistence:
    size: 100Gi
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi
```

## mlflow/2.1.0-1

Mlflow 카탈로그:

외부 minio 사용할 때

아래 항목은 사이트에 따라 수정이 필요합니다.

- password

```yaml
tracking:
  auth:
    enabled: false
  service:
    type: ClusterIP
  ingress:
    enabled: true
    pathType: ImplementationSpecific
    hostname: "{{ .Name }}.{{ .Domain }}"
    annotations:
      cert-manager.io/cluster-issuer: "root-ca-issuer"
      cert-manager.io/duration: 8760h
      cert-manager.io/renew-before: 720h
      konghq.com/plugins: oidc-plugin, keycloak-authz-plugin
    path: /
    tls: false
    extraTls:
      - hosts:
          - "{{ .Name }}.{{ .Domain }}"
        secretName: "{{ .Name }}-tls-secret"
  extraArgs:
    - "--gunicorn-opts=--timeout 600"
postgresql:
  enabled: true
  auth:
    username: mlflow
    password: ""
    database: bitnami_mlflow
    existingSecret: "$INFISICAL_SECRET"
minio:
  enabled: false
externalS3:
  host: "$externalS3.host"
  port: 443
  useCredentialsInSecret: true
  existingSecret: "$INFISICAL_SECRET"
  existingSecretAccessKeyIDKey: "root-user"
  existingSecretKeySecretKey: "root-password"
  protocol: "https"
  bucket: "$externalS3.bucket"
  serveArtifacts: true
```

쿼터
```yaml
# small
tracking:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi  
run:
  resources:
    requests:
      cpu: 250m
      memory: 512Mi
    limits:
      cpu: 500m
      memory: 1Gi   

postgresql:
  primary:
    resources:
      requests:
        cpu: 250m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi     
    persistence:
      storageClass: ""
      size: 5Gi

# medium
tracking:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi  
run:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi   

postgresql:
  primary:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi     
    persistence:
      storageClass: ""
      size: 20Gi

# large
tracking:
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi  
run:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi   

postgresql:
  primary:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi     
    persistence:
      storageClass: ""
      size: 100Gi
```

## kubeflow/1.10.0

Kubeflow 카탈로그:

```yaml
apiVersion: kubeflow.org/v1
kind: Profile
metadata:
  name: "{{ .Name }}"
spec:
  owner:
    kind: User
    name: "{{ .Email }}"
  resourceQuotaSpec:
    hard:
      cpu: "16"
      memory: 32Gi
      persistentvolumeclaims: "12"
```

쿼터
```yaml
# small


# medium


# large

```

## Rancher/2.10.1-1

Rancher 카탈로그:

```yaml
hostname: "{{ .Name }}.{{ .Domain }}"
ingress:
  enable: true
  tls:
    source: secret
    secretName: rancher-tls-ingress
  extraAnnotations:
    konghq.com/connect-timeout: "30000"
    konghq.com/read-timeout: "1800000"
    konghq.com/write-timeout: "1800000"
    cert-manager.io/cluster-issuer: "root-ca-issuer"
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

newPassword: "$PASSWORD_KEY"
```

쿼터
```yaml
# small
resources: 
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 2000m
    memory: 4Gi

# medium
resources: 
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi

# large
resources: 
  requests:
    cpu: 4000m
    memory: 8Gi
  limits:
    cpu: 8000m
    memory: 16Gi
```

## rancher-monitoring-crd/104.1.2

rancher-monitoring-crd 카탈로그:

```yaml
---
```

## rancher-monitoring/104.1.2

rancher-monitoring 카탈로그:

```yaml
global:
  cattle:
    clusterId: local
    clusterName: local

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
    retention: 30d
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

쿼터
```yaml
# small


# medium


# large

```

## spark-operator/2.0.2

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

쿼터
```yaml
# small
controller:
  resources:
    requests:
      cpu: 100m
      memory: 300Mi
    limits:
      cpu: 200m
      memory: 512Mi

webhook:
  resources:
    requests:
      cpu: 50m
      memory: 128Mi
    limits:
      cpu: 100m
      memory: 256Mi

# medium
controller:
  resources:
    requests:
      cpu: 200m
      memory: 512Mi
    limits:
      cpu: 500m
      memory: 1Gi

webhook:
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 200m
      memory: 512Mi

# large
controller:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi

webhook:
  resources:
    requests:
      cpu: 200m
      memory: 512Mi
    limits:
      cpu: 500m
      memory: 1Gi
```

## qdrant/1.12.4

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
    cert-manager.io/cluster-issuer: "root-ca-issuer"
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
    konghq.com/plugins: oidc-plugin, keycloak-authz-plugin
  hosts:
    - host: "{{ .Name }}.{{ .Domain }}"
      paths:
        - path: /
          pathType: Prefix
          servicePort: 6333
  tls:
    - hosts:
        - "{{ .Name }}.{{ .Domain }}"
      secretName: "{{ .Name }}-tls-secret"

dip:
  mainPath: dashboard      
```

쿼터
```yaml
# small
resources:
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 2000m
    memory: 4Gi

persistence:
  size: 10Gi
  storageClassName: ""    

# medium
resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi

persistence:
  size: 100Gi
  storageClassName: ""      

# large
resources:
  requests:
    cpu: 4000m
    memory: 8Gi
  limits:
    cpu: 8000m
    memory: 16Gi

persistence:
  size: 1Ti
  storageClassName: ""      
```

## langflow-ide/0.1.0

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
        value: "True"
      - name: LANGFLOW_SUPERUSER
        value: "$langflow.backend.env.username"
      - name: LANGFLOW_SUPERUSER_PASSWORD
        value: "$langflow.backend.env.password"  
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
            name: "$INFISICAL_SECRET"
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
    cert-manager.io/cluster-issuer: "root-ca-issuer"
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
    konghq.com/plugins: oidc-plugin, keycloak-authz-plugin
  hosts:
    - host: "{{ .Name }}.{{ .Domain }}"
      paths:
        - path: /
          pathType: ImplementationSpecific
          servicePort: 7860
  tls:
    - hosts:
        - "{{ .Name }}.{{ .Domain }}"
      secretName: "{{ .Name }}-tls-secret"

postgresql:
  enabled: true
  fullnameOverride: "{{ .Name }}-ide-postgresql-service"
  auth:
    username: "langflow"
    password: ""
    database: "langflow-db"
    existingSecret: "$INFISICAL_SECRET"
  primary:
    persistence:
      size: 5Gi
      storageClass: ""
```

쿼터
```yaml
# small
langflow:
  backend:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi
  frontend:
    resources:
      requests:
        cpu: 300m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi
postgresql:
  primary:
    persistence:
      size: 5Gi
      storageClass: "longhorn"
    resources:
      requests: 
        cpu: 250m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi

# medium
langflow:
  backend:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi
  frontend:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi
postgresql:
  primary:
    persistence:
      size: 20Gi
      storageClass: "longhorn"
    resources:
      requests: 
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi

# large
langflow:
  backend:
    resources:
      requests:
        cpu: 2000m
        memory: 4Gi
      limits:
        cpu: 4000m
        memory: 8Gi
  frontend:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi
postgresql:
  primary:
    persistence:
      size: 100Gi
      storageClass: "longhorn"
    resources:
      requests: 
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi
```

## superset/0.13.5-1

superset 카탈로그:

```yaml
configOverrides:
  mapbox: |
    MAPBOX_API_KEY = '$configOverrides.mapbox' 
    ENABLE_PROXY_FIX = True
    FEATURE_FLAGS = {
      "DYNAMIC_PLUGINS": True
    }
  secret: |
    SECRET_KEY = '$configOverrides.secret'
  my_override: |
    FEATURE_FLAGS = {
    	"ENABLE_TEMPLATE_REMOVE_FILTERS" : True,
    	"ENABLE_TEMPLATE_PROCESSING": True,	
        "DASHBOARD_NATIVE_FILTERS" : True,
        "DASHBOARD_NATIVE_FILTERS_SET": True
    }     
  enable_oauth: |
    from flask_appbuilder.security.manager import (AUTH_DB, AUTH_OAUTH)
    from superset.security import SupersetSecurityManager
    from flask import request

    import requests
    import logging

    class CustomSsoSecurityManager(SupersetSecurityManager):
        def oauth_user_info(self, provider, response=None):
            me = self.appbuilder.sm.oauth_remotes[provider].get("openid-connect/userinfo")
            me.raise_for_status()
            data = me.json()

            logging.debug("User info from Keycloak: %s", data)

            role = []
            username = data.get("preferred_username", "")
            host = request.host
            dip_api_url =  "http://dip-api.platform.svc.cluster.local:8087"
            
            url = f"{dip_api_url}/gwapi/v1/projectusers/{username}"
            request_data = {"url": f"https://{host}"}
            response = requests.post(url, json=request_data, headers={"Content-Type": "application/json"}, verify=False)

            if response.status_code == 200:
                logging.info(f"API 요청 성공: {response.status_code}, {response.text}")
                role.append(response.json().get("roleName",""))
            else:
                logging.info(f"API 요청 실패: {response.status_code}, {response.text}")
                role.append("")

            return {
                "username": data.get("preferred_username", ""),
                "first_name": data.get("given_name", ""),
                "last_name": data.get("family_name", ""),
                "email": data.get("email", ""),
                "role_keys": role,
            }

    AUTH_TYPE = AUTH_OAUTH
    AUTH_USER_REGISTRATION = True
    AUTH_USER_REGISTRATION_ROLE = "Public"
    AUTH_ROLES_SYNC_AT_LOGIN = True
    CUSTOM_SECURITY_MANAGER = CustomSsoSecurityManager

    OAUTH_PROVIDERS = [
        {
            "name": "keycloak",
            "icon": "fa-key",
            "token_key": "access_token",
            "remote_app": {
                "client_id": "$KEYCLOAK_CLIENT_ID",
                "client_secret": "$KEYCLOAK_CLIENT_SECRET",
                "client_kwargs": {
                  "scope": "openid email profile",
                  'verify': False
                },
                'server_metadata_url': '$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/.well-known/openid-configuration',
                'api_base_url': '$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/protocol/'
            }
        }
    ]

    AUTH_ROLES_MAPPING = {
    'root': ['Admin'],
    'admin': ['Admin'],
    'manager': ['Admin'],
    'member': ['Alpha'],
    }

bootstrapScript: |
  #!/bin/bash
  apt update
  apt install -y pkg-config build-essential default-libmysqlclient-dev libpq-dev
  pip install sqlalchemy-drill psycopg2-binary Authlib
  pip install mysqlclient

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
    cert-manager.io/cluster-issuer: "root-ca-issuer"
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
  path: /
  pathType: ImplementationSpecific
  hosts:
    - "{{ .Name }}.{{ .Domain }}"
  tls:
    - hosts:
        - "{{ .Name }}.{{ .Domain }}"
      secretName: "{{ .Name }}-tls-secret"

supersetNode:
  replicas:
    enabled: true
    replicaCount: 1

  connections:
    redis_host: "{{ .Name }}-redis-headless"
    redis_port: "6379"
    redis_user: ""
    redis_cache_db: "1"
    redis_celery_db: "0"
    redis_ssl:
      enabled: false
      ssl_cert_reqs: CERT_NONE
    db_host: "{{ .Name }}-postgresql"
    db_port: "5432"
    db_user: superset
    db_pass: "$supersetNode.connections.db_pass"
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
    password: ""
    database: superset
    existingSecret: "$INFISICAL_SECRET"
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
    existingSecret: ""
    existingSecretPasswordKey: ""
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

쿼터
```yaml
# small
supersetNode:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi

supersetWorker:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi

postgresql:
  primary:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 8Gi
    resources:
      requests:
        cpu: 250m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi

redis:
  master:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 8Gi
    resources:
      requests:
        cpu: 200m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi

# medium
supersetNode:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi

supersetWorker:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi

postgresql:
  primary:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 50Gi
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi

redis:
  master:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 20Gi
    resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        cpu: 1000m
        memory: 1Gi

# large
supersetNode:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi

supersetWorker:
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi

postgresql:
  primary:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 200Gi
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi

redis:
  master:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 100Gi
    resources:
      requests:
        cpu: 1000m
        memory: 1Gi
      limits:
        cpu: 2000m
        memory: 2Gi
```

## ollama/1.12.2

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
    type: "nvidia"
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
    cert-manager.io/cluster-issuer: "root-ca-issuer"
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
    konghq.com/plugins: oidc-plugin, keycloak-authz-plugin
  hosts:
    - host: "{{ .Name }}.{{ .Domain }}"
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        - "{{ .Name }}.{{ .Domain }}"
      secretName: "{{ .Name }}-tls-secret"
```

쿼터
```yaml
# small
persistentVolume:
  enabled: true
  size: 30Gi
  storageClass: longhorn

resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi

# medium
persistentVolume:
  enabled: true
  size: 100Gi
  storageClass: longhorn

resources:
  requests:
    cpu: 4000m
    memory: 8Gi
    nvidia.com/gpu: "1"
  limits:
    cpu: 8000m
    memory: 16Gi
    nvidia.com/gpu: "1"

# large
persistentVolume:
  enabled: true
  size: 500Gi
  storageClass: longhorn

resources:
  requests:
    cpu: 8000m
    memory: 16Gi
    nvidia.com/gpu: "2"
  limits:
    cpu: 16000m
    memory: 32Gi
    nvidia.com/gpu: "2"
```

## flowise/3.10.2

flowise 카탈로그:

```yaml
image:
  registry: docker.io

persistence:
  enabled: true
  size: 1Gi
  storageClass: longhorn

resources: {}

ingress:
  enabled: true
  annotations:
    cert-manager.io/cluster-issuer: "root-ca-issuer"
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
    konghq.com/plugins: oidc-plugin, keycloak-authz-plugin
  hosts:
    - host: "{{ .Name }}.{{ .Domain }}"
      paths:
        - /
  tls:
    - hosts:
        - "{{ .Name }}.{{ .Domain }}"
      secretName: "{{ .Name }}-tls-secret"

postgresql:
  enabled: true
  auth:
    existingSecret: "$INFISICAL_SECRET"
  primary:
    persistence:
      enabled: true
      size: 8Gi
      storageClass: ""
```

## flowise/6.0.0

flowise 카탈로그:

```yaml
global:
  storageClass: "longhorn"

image:
  registry: docker.io

persistence:
  enabled: true
  size: 1Gi
  storageClass: longhorn

resources: {}

worker:
  enabled: true
  replicaCount: 1
  resources: {}

ingress:
  enabled: true
  annotations:
    cert-manager.io/cluster-issuer: "root-ca-issuer"
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
    konghq.com/plugins: oidc-plugin, keycloak-authz-plugin
  hosts:
    - host: "{{ .Name }}.{{ .Domain }}"
      paths:
        - /
  tls:
    - hosts:
        - "{{ .Name }}.{{ .Domain }}"
      secretName: "{{ .Name }}-tls-secret"

postgresql:
  enabled: true
  auth:
    existingSecret: "$INFISICAL_SECRET"
  primary:
    persistence:
      enabled: true
      size: 8Gi

redis:
  enabled: true
```

쿼터
```yaml
# small
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 1000m
    memory: 2Gi
persistence:
  enabled: true
  size: 2Gi
  storageClass: longhorn
worker:
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 100m
      memory: 128Mi
postgresql:
  enabled: true
  primary:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 5Gi
    resources:
      requests:
        cpu: 250m 
        memory: 512Mi
      limits: 
        cpu: 500m
        memory: 1Gi

# medium
resources:
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 2000m
    memory: 4Gi
persistence:
  enabled: true
  size: 10Gi
  storageClass: longhorn
worker:
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 100m
      memory: 128Mi
postgresql:
  enabled: true
  primary:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 20Gi
    resources:
      requests:
        cpu: 500m 
        memory: 1Gi
      limits: 
        cpu: 1000m
        memory: 2Gi

# large
resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi
persistence:
  enabled: true
  size: 50Gi
  storageClass: longhorn
worker:
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 100m
      memory: 128Mi
postgresql:
  enabled: true
  primary:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 100Gi
    resources:
      requests:
        cpu: 1000m 
        memory: 2Gi
      limits: 
        cpu: 2000m
        memory: 4Gi
```

## open-webui/0.5.4

open-webui 카탈로그:

```yaml
ollama:
  enabled: false
tika:
  enabled: false
websocket:
  enabled: false
redis-cluster:
  enabled: false
ingress:
  enabled: true
  annotations:
    cert-manager.io/cluster-issuer: "root-ca-issuer"
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
  host: "{{ .Name }}.{{ .Domain }}"
  tls: true
  existingSecret: "{{ .Name }}-tls-secret"
persistence:
  enabled: true
  size: 2Gi
  existingClaim: ""
  subPath: ""
  accessModes:
    - ReadWriteOnce
  storageClass: ""
  selector: {}
  annotations: {}
extraEnvVars:
  - name: OPENAI_API_KEY
    value: "$extraEnvVars"
  - name: OAUTH_CLIENT_ID
    value: $KEYCLOAK_CLIENT_ID
  - name: OAUTH_CLIENT_SECRET
    value: $KEYCLOAK_CLIENT_SECRET
  - name: OPENID_PROVIDER_URL
    value: $KEYCLOAK_URL/realms/$KEYCLOAK_REALM/.well-known/openid-configuration
  - name: OAUTH_PROVIDER_NAME
    value: paasup
  - name: OAUTH_SCOPES
    value: "openid email profile"
  - name: ENABLE_LOGIN_FORM
    value: "true"
  - name: SSL_CERT_FILE
    value: "/etc/ssl/certs/keycloak/ca.crt"
  - name: ENABLE_OAUTH_SIGNUP
    value: "true"
  - name: OAUTH_MERGE_ACCOUNTS_BY_EMAIL
    value: "true"
  - name: DEFAULT_USER_ROLE
    value: user
  - name: ENV
    value: prod

volumeMounts:
  initContainer: []
  container:
    - name: "keycloak-tls"
      mountPath: "/etc/ssl/certs/keycloak"

volumes:
  - name: "keycloak-tls"
    secret:
      secretName: keycloak-tls
```

쿼터
```yaml
# small
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 1000m
    memory: 2Gi
persistence:
  enabled: true
  size: 2Gi
  accessModes:
    - ReadWriteOnce
  storageClass: ""

# medium
resources:
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 2000m
    memory: 4Gi
persistence:
  enabled: true
  size: 10Gi
  accessModes:
    - ReadWriteOnce
  storageClass: ""

# large
resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi
persistence:
  enabled: true
  size: 50Gi
  accessModes:
    - ReadWriteOnce
  storageClass: ""
```

## vllm/0.0.11

vllm 카탈로그:

```yaml
servingEngineSpec:
  modelSpec:
    - name: "llama3"
      repository: "vllm/vllm-openai"
      tag: "latest"
      modelURL: "$servingEngineSpec.modelSpec.modelURL"
      replicaCount: 1

      requestCPU: 10
      requestMemory: "16Gi"
      requestGPU: 1

      pvcStorage: "50Gi"

      vllmConfig:
        enableChunkedPrefill: false
        enablePrefixCaching: false
        maxModelLen: 24576
        dtype: "float16"
        extraArgs: ["--disable-log-requests", "--gpu-memory-utilization", "0.8"]
      hf_token: "$servingEngineSpec.modelSpec.hf_token"
  resources:
    requests:
      cpu: "4"
      memory: "16G"
    limits:
      cpu: "8"
      memory: "32G"

routerSpec:
  repository: "lmcache/lmstack-router"
  tag: "latest"
  resources:
    requests:
      cpu: "2"
      memory: "8G"
    limits:
      cpu: "4"
      memory: "16G"
  ingress:
    enabled: true
    className: ""
    annotations:
      cert-manager.io/cluster-issuer: "root-ca-issuer"
      cert-manager.io/duration: 8760h
      cert-manager.io/renew-before: 720h
      konghq.com/plugins: oidc-plugin, keycloak-authz-plugin
    hosts:
      - host: "{{ .Name }}.{{ .Domain }}"
        paths:
          - path: /
            pathType: Prefix
    tls:
      - secretName: "{{ .Name }}-tls-secret"
        hosts:
          - "{{ .Name }}.{{ .Domain }}"
```

쿼터
```yaml
# small


# medium


# large

```

## langfuse/1.0.0-rc.2-1

langfuse 카탈로그:

```yaml
global:
  security:
    allowInsecureImages: true

langfuse:
  logging:
    level: info
  salt:
    value: "$langfuse.salt.value"
  encryptionKey:
    value: "$langfuse.encryptionKey.value"

  ingress:
    enabled: true
    annotations:
      cert-manager.io/cluster-issuer: "root-ca-issuer"
    hosts:
      - host: "{{ .Name }}.{{ .Domain }}"
        paths:
          - path: /
            pathType: ImplementationSpecific
    tls:
      enabled: true
      secretName: "{{ .Name }}-tls-secret"
  web:
    image:
      repository: langfuse/langfuse
    resources: {}
    replicas: 1
  worker:
    image:
      repository: langfuse/langfuse-worker
    resources: {}
    replicas: 1

  nextauth:
    url: "https://{{ .Name }}.{{ .Domain }}"
    secret:
      value: "$langfuse.nextauth.secret.value"
  additionalEnv:
    - name: AUTH_DISABLE_USERNAME_PASSWORD
      value: "true"
    - name: AUTH_KEYCLOAK_CLIENT_ID
      value: "$KEYCLOAK_CLIENT_ID"
    - name: "AUTH_KEYCLOAK_CLIENT_SECRET"
      value: "$KEYCLOAK_CLIENT_SECRET"
    - name: "AUTH_KEYCLOAK_ISSUER"
      value: "$KEYCLOAK_URL/realms/$KEYCLOAK_REALM"
    - name: NODE_TLS_REJECT_UNAUTHORIZED
      value: "0"

postgresql:
  auth:
    username: "postgres"
    existingSecret: "$INFISICAL_SECRET"
    secretKeys:
      userPasswordKey: "postgres-password"

  migration:
    autoMigrate: true

  persistence:
    enabled: true
    storageClass: ""
    size: 5Gi

redis:
  auth:
    enabled: true
    existingSecret: "$INFISICAL_SECRET"
    existingSecretPasswordKey: "valkey-password"
  primary:
    persistence:
      enabled: true
      storageClass: ""
      size: 5Gi

clickhouse:
  deploy: true
  auth:
    username: default
    password: ""
    existingSecret: "$INFISICAL_SECRET"
    existingSecretKey: "admin-password"

  shards: 1
  persistence:
    enabled: true
    storageClass: ""
    size: 10Gi

s3:
  deploy: false
  bucket: "$s3.bucket"
  region: "auto"
  endpoint: "https://$s3.endpoint"
  accessKeyId:
    value: "$s3.accessKeyId.value"
  secretAccessKey:
    value: "$s3.secretAccessKey.value"
```

쿼터
```yaml
# small
langfuse:
  web:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi    
  worker:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi     

redis:
  primary:
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 200m
        memory: 256Mi     
    persistence:
      enabled: true
      size: 8Gi
      storageClass: ""

postgresql:
  primary:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 10Gi
    resources:
      requests:
        cpu: 250m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi     
    
clickhouse:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi   
  persistence:
    enabled: true
    size: 8Gi
    storageClass: ""
  zookeeper:
    enabled: true
    resources:
      requests:
        cpu: 250m
        memory: 384Mi
      limits:
        cpu: 375m
        memory: 512Mi

# medium
langfuse:
  web:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi    
  worker:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi     

redis:
  primary:
    resources:
      requests:
        cpu: 200m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi     
    persistence:
      enabled: true
      size: 20Gi
      storageClass: ""

postgresql:
  primary:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 50Gi
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi     
    
clickhouse:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi   
  persistence:
    enabled: true
    size: 50Gi
    storageClass: ""
  zookeeper:
    enabled: true
    resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        cpu: 750m
        memory: 768Mi

# large
langfuse:
  web:
    resources:
      requests:
        cpu: 2000m
        memory: 4Gi
      limits:
        cpu: 4000m
        memory: 8Gi    
  worker:
    resources:
      requests:
        cpu: 2000m
        memory: 4Gi
      limits:
        cpu: 4000m
        memory: 8Gi     

redis:
  primary:
    resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        cpu: 1000m
        memory: 1Gi     
    persistence:
      enabled: true
      size: 100Gi
      storageClass: ""

postgresql:
  primary:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 200Gi
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi     
    
clickhouse:
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi   
  persistence:
    enabled: true
    size: 500Gi
    storageClass: ""
  zookeeper:
    enabled: true
    resources:
      requests:
        cpu: 2000m
        memory: 4Gi
      limits:
        cpu: 4000m
        memory: 8Gi
```

## postgresql-ha/11.9.4-1

postgresql-ha 카탈로그:

```yaml
global:
  imageRegistry: ""

postgresql:
  username: postgres
  existingSecret: "$INFISICAL_SECRET"

  maxConnections: "200"
  sharedPreloadLibraries: "repmgr, pgaudit, pg_stat_statements, pgoutput"

  extendedConf: |-
    wal_level = logical
    max_replication_slots = 4
    max_wal_senders = 4  

  replicaCount: 1

  extraEnvVars:
    - name: TZ
      value: Asia/Seoul

  resources:
    requests:
      cpu: 100m
      memory: 512Mi
    limits:
      cpu: 500m
      memory: 1024Mi

  tolerations: []

  nodeSelector: {}

pgpool:
  existingSecret: "$INFISICAL_SECRET"

  replicaCount: 0

persistence:
  enabled: true
  storageClass: ""
  size: 1Gi

volumePermissions:
  enabled: true
  podSecurityContext:
    runAsUser: 0
```

쿼터
```yaml
# small
postgresql:
  replicaCount: 3
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi

pgpool:
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 200m
      memory: 256Mi


persistence:
  enabled: true
  size: 20Gi
  storageClass: ""

# medium
postgresql:
  replicaCount: 3
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi

pgpool:
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi


persistence:
  enabled: true
  size: 100Gi
  storageClass: ""

# large
postgresql:
  replicaCount: 3
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi

pgpool:
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi


persistence:
  enabled: true
  size: 500Gi
  storageClass: ""
```

## airflow/1.16.0

airflow 카탈로그:
- [ ] 관리자배포
- [ ] 클러스터단독배포
- [ ] 테넌트사용
- [ ] keycloak사용
- [ ] 공개관리

```yaml
ingress:
  web:
    enabled: true
    annotations:
      cert-manager.io/cluster-issuer: "root-ca-issuer"
      cert-manager.io/duration: 8760h
      cert-manager.io/renew-before: 720h
      konghq.com/plugins: oidc-plugin, keycloak-authz-plugin
    hosts:
      - name: "{{ .Name }}.{{ .Domain }}"
        tls:
          enabled: true
          secretName: "{{ .Name }}-tls-secret"

executor: "KubernetesExecutor"

config:
  core:
    executor: KubernetesExecutor
    default_timezone: kst
  logging:
    colored_console_log: "False"
    logging_level: "INFO"
  webserver:
    enable_proxy_fix: "True"
    rbac: "True"
    default_ui_timezone: kst

scheduler:
  replicas: 1

dags:
  persistence:
    enabled: true
    size: 5Gi
    storageClassName: longhorn
    accessMode: ReadWriteMany
  gitSync:
    enabled: true
    repo: "$dags.gitSync.repo"
    branch: master
    rev: HEAD
    depth: 1
    subPath: ""
    credentialsSecret: "$INFISICAL_SECRET"
    env:
      - name: GIT_SSL_NO_VERIFY
        value: "true"

webserver:
  defaultUser:
    enabled: true
    password: "$webserver.defaultUser.password"
  livenessProbe:
    initialDelaySeconds: 120
  readinessProbe:
    initialDelaySeconds: 120
  startupProbe:
    initialDelaySeconds: 30
  webserverConfig: |
    AUTH_ROLE_PUBLIC = 'User'

logs:
  persistence:
    enabled: true
    size: 5Gi
    storageClassName: longhorn

statsd:
  enabled: false

postgresql:
  enabled: true
  auth:
    username: "postgres"
    existingSecret: "$INFISICAL_SECRET"
    secretKeys:
      userPasswordKey: "postgres-password"
  primary:
    persistence:
      enabled: true
      size: 8Gi
      storageClass: ""

migrateDatabaseJob:
  useHelmHooks: false

data:
  metadataSecretName: "$INFISICAL_SECRET"
```

쿼터
```yaml
# small
worker:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 2000m
      memory: 2Gi
scheduler:
  replicas: 1
  resources:
    requests:
      cpu: 250m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi
webserver:
  replicas: 1
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi
dags:
  persistence:
    enabled: true
    size: 1Gi
    storageClassName: "longhorn"

logs:
  persistence:
    enabled: true
    size: 5Gi
    storageClassName: longhorn
redis:
  persistence:
    enabled: true
    size: 1Gi
    storageClassName: "longhorn"
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 200m
      memory: 256Mi
postgresql:
  primary:
    persistence:
      enabled: true
      size: 10Gi
      storageClass: "longhorn"
    resources:
      requests:
        cpu: 250m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi

# medium
worker:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 4000m
      memory: 4Gi
scheduler:
  replicas: 1
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 2000m
      memory: 2Gi
webserver:
  replicas: 1
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi
dags:
  persistence:
    enabled: true
    size: 5Gi
    storageClassName: "longhorn"

logs:
  persistence:
    enabled: true
    size: 20Gi
    storageClassName: longhorn
redis:
  persistence:
    enabled: true
    size: 5Gi
    storageClassName: "longhorn"
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi
postgresql:
  primary:
    persistence:
      enabled: true
      size: 50Gi
      storageClass: "longhorn"
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi

# large
worker:
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 8000m
      memory: 8Gi
scheduler:
  replicas: 1
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 4000m
      memory: 4Gi
webserver:
  replicas: 1
  resources:
    requests:
      cpu: 1000m
      memory: 1Gi
    limits:
      cpu: 2000m
      memory: 2Gi
dags:
  persistence:
    enabled: true
    size: 20Gi
    storageClassName: "longhorn"

logs:
  persistence:
    enabled: true
    size: 100Gi
    storageClassName: longhorn
redis:
  persistence:
    enabled: true
    size: 20Gi
    storageClassName: "longhorn"
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi
postgresql:
  primary:
    persistence:
      enabled: true
      size: 200Gi
      storageClass: "longhorn"
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi
```

## litellm/0.4.4

litellm 카탈로그:

```yaml
masterkey: "$masterkey"

proxy_config:
  model_list: []

ingress:
  enabled: true
  className: "kong"
  annotations:
    cert-manager.io/cluster-issuer: "root-ca-issuer"
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
  hosts:
    - host: "{{ .Name }}.{{ .Domain }}"
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - secretName: "{{ .Name }}-tls-secret"
      hosts:
        - "{{ .Name }}.{{ .Domain }}"

dip:
  mainPath: ui        
```

쿼터
```yaml
# small
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 1000m
    memory: 2Gi

postgresql:
  primary:
    resources:
      requests:
        cpu: 250m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi    
    persistence:
      storageClass: ""
      size: 5Gi

# medium
resources:
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 2000m
    memory: 4Gi

postgresql:
  primary:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi    
    persistence:
      storageClass: ""
      size: 20Gi

# large
resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi

postgresql:
  primary:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi    
    persistence:
      storageClass: ""
      size: 100Gi
```

## unitycatalog/0.2.0

unitycatalog 카탈로그:

```yaml
storage:
  credentials:
    s3:
      - bucketPath: "$storage.credentials.s3.bucketPath"
        region: "us-east-1"
        awsRoleArn:
        serviceEndpoint: "$storage.credentials.s3.serviceEndpoint"
        credentialsSecretName: "$INFISICAL_SECRET"

auth:
  enabled: true
  users:
    - name: "{{ .Username }}"
      email: "{{ .Email }}"

  provider: keycloak
  authorizationUrl: "$KEYCLOAK_URL/auth/realms/$KEYCLOAK_REALM/protocol/openid-connect/auth"
  clientSecretName: "$INFISICAL_SECRET"

privateCA:
  enabled: true
  secretName: "{{ .Name }}-tls-secret"

server:
  statefulset:
    image:
      repository: paasup/unitycatalog
      tag: "0.3.0-minio-250522"
    resources: {}
    nodeSelector: {}
    tolerations: []
    affinity: {}
  ingress:
    enabled: true
    className: kong
    annotations:
      cert-manager.io/cluster-issuer: root-ca-issuer
      konghq.com/https-redirect-status-code: "301"
      konghq.com/protocols: https
    hosts:
      - host: "{{ .Name }}.{{ .Domain }}"
        paths:
          - path: /
            pathType: ImplementationSpecific
    tls:
      - hosts:
          - "{{ .Name }}.{{ .Domain }}"
        secretName: "{{ .Name }}-tls-secret"
  config:
    persistence:
      enabled: true
      accessModes: ["ReadWriteOnce"]
      size: 100Mi
      storageClassName: ""
    logLevel: "INFO"

db:
  type: postgresql
  postgresqlConfig:
    user: uc_default_user
    password: "$db.postgresqlConfig.password"
    database: ucdb

postgresql:
  enabled: true
  auth:
    username: "uc_default_user"
    password: ""
    database: "ucdb"
    existingSecret: "$INFISICAL_SECRET"

  persistence:
    enabled: true
    accessModes:
      - ReadWriteOnce
    size: 5Gi
    storageClassName: ""
```

쿼터
```yaml
# small
server:
  config:
    persistence:
      enabled: true
      size: 10Gi
      storageClassName: "longhorn"
  statefulset:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi    
postgresql:
  primary:
    persistence:
      storageClassName: "longhorn"
      size: 20Gi
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi       

# medium
server:
  config:
    persistence:
      enabled: true
      size: 100Gi
      storageClassName: "longhorn"
  statefulset:
    resources:
      requests:
        cpu: 2000m
        memory: 4Gi
      limits:
        cpu: 4000m
        memory: 8Gi    
postgresql:
  primary:
    persistence:
      storageClassName: "longhorn"
      size: 200Gi
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi       

# large
server:
  config:
    persistence:
      enabled: true
      size: 1Ti
      storageClassName: "longhorn"
  statefulset:
    resources:
      requests:
        cpu: 4000m
        memory: 8Gi
      limits:
        cpu: 8000m
        memory: 16Gi    
postgresql:
  primary:
    persistence:
      storageClassName: "longhorn"
      size: 2Ti
    resources:
      requests:
        cpu: 2000m
        memory: 4Gi
      limits:
        cpu: 4000m
        memory: 8Gi       
```

## nemo/25.4.0

nemo 카탈로그:

```yaml
ngcAPIKey: "$ngcAPIKey"

imagePullSecrets:
  - name: nvcrimagepullsecret
    registry: nvcr.io
    username: "$oauthtoken"
    password: "$ngcAPIKey"

data-store:
  enabled: true
  external:
    rootUrl: "https://nemo-datastore-{{ .Name }}.{{ .Domain }}"
    domain: "nemo-datastore-{{ .Name }}.{{ .Domain }}"

customizer:
  enabled: true
  customizerConfig:
    meta/llama-3.2-1b-instruct:
      enabled: true

nim:
  enabled: false

evaluator:
  enabled: true
  argoWorkflows:
    enabled: true
    crds:
      install: false

guardrails:
  enabled: true

nemo-operator:
  enabled: true

nim-operator:
  enabled: true

dgxc-admission-controller:
  enabled: false

entity-store:
  enabled: true

volcano:
  enabled: true

deployment-management:
  enabled: true
  deployments:
    defaultStorageClass: "longhorn"

nim-proxy:
  enabled: true

ingress:
  enabled: true
  annotations:
    cert-manager.io/cluster-issuer: root-ca-issuer
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
  className: "kong"
  tls:
    - hosts:
        - "nemo-{{ .Name }}.{{ .Domain }}"
      secretName: "{{ .Name }}-tls-secret"
  hosts:
    default:
      name: "nemo-{{ .Name }}.{{ .Domain }}"
    nimProxy:
      name: "nim-{{ .Name }}.{{ .Domain }}"
    dataStore:
      name: "data-store-{{ .Name }}.{{ .Domain }}"

virtualService:
  enabled: false
```

쿼터
```yaml
# small
data-store:
  enabled: true
  persistence:
    enabled: true
    size: 1Gi
    storageClass: ""
  resources:
    requests:
      cpu: 200m
      memory: 512Mi
    limits:
      cpu: 500m
      memory: 1Gi  
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 1Gi
      resources:
        requests:
          cpu: 250m
          memory: 512Mi
        limits:
          cpu: 500m
          memory: 1Gi        

customizer:
  enabled: true
  modelsStorage:
    enabled: true
    size: 20Gi
    storageClassName: ""
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 5Gi
      resources:
        requests:
          cpu: 250m
          memory: 512Mi
        limits:
          cpu: 500m
          memory: 1Gi        

evaluator:
  enabled: true
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi   
  argoWorkflows:
    enabled: true
    crds:
      install: false   
    controller:
      resources:
        requests:
          cpu: 500m
          memory: 1Gi
        limits:
          cpu: 1000m
          memory: 2Gi        
    server:
      resources:
        requests:
          cpu: 250m
          memory: 512Mi
        limits:
          cpu: 500m
          memory: 1Gi
  milvus:
    standalone:
      resources:
        requests:
          cpu: 500m
          memory: 1Gi
        limits:
          cpu: 1000m
          memory: 2Gi      
      persistence:
        persistentVolumeClaim:
          storageClass: ""
          size: 10Gi
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 5Gi
      resources:
        requests:
          cpu: 250m
          memory: 512Mi
        limits:
          cpu: 500m
          memory: 1Gi      

guardrails:
  enabled: true
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi  

entity-store:
  enabled: true
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 5Gi
      resources:
        requests:
          cpu: 250m
          memory: 512Mi
        limits:
          cpu: 500m
          memory: 1Gi      

nemo-operator:
  enabled: true
  controllerManager:
    kubeRbacProxy:
      resources:
        requests:
          cpu: 5m
          memory: 64Mi
        limits:
          cpu: 500m
          memory: 128Mi
    manager:
      resources:
        requests:
          cpu: 512m
          memory: 1Gi
        limits:
          cpu: 1024m
          memory: 2Gi

nim-operator:
  enabled: true
  operator:
    resources:
      requests:
        cpu: 200m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi

deployment-management:
  enabled: true
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi  

nim-proxy:
  enabled: true
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi
          
volcano:
  enabled: true
  custom:
    admission_enable: true
    admission_replicas: 1
    controller_enable: true
    controller_replicas: 1
    scheduler_enable: true
    scheduler_replicas: 1
    admission_resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 300m
        memory: 300Mi
    scheduler_resources:
      requests:
        cpu: 200m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi
    controller_resources:
      requests:
        cpu: 200m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi

# medium
data-store:
  enabled: true
  persistence:
    enabled: true
    size: 10Gi
    storageClass: ""
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi  
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 10Gi
      resources:
        requests:
          cpu: 500m
          memory: 1Gi
        limits:
          cpu: 1000m
          memory: 2Gi        

customizer:
  enabled: true
  modelsStorage:
    enabled: true
    size: 100Gi
    storageClassName: ""
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 20Gi
      resources:
        requests:
          cpu: 500m
          memory: 1Gi
        limits:
          cpu: 1000m
          memory: 2Gi        

evaluator:
  enabled: true
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi   
  argoWorkflows:
    enabled: true
    crds:
      install: false   
    controller:
      resources:
        requests:
          cpu: 1000m
          memory: 2Gi
        limits:
          cpu: 2000m
          memory: 4Gi        
    server:
      resources:
        requests:
          cpu: 500m
          memory: 1Gi
        limits:
          cpu: 1000m
          memory: 2Gi
  milvus:
    standalone:
      resources:
        requests:
          cpu: 1000m
          memory: 2Gi
        limits:
          cpu: 2000m
          memory: 4Gi      
      persistence:
        persistentVolumeClaim:
          storageClass: ""
          size: 50Gi
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 20Gi
      resources:
        requests:
          cpu: 500m
          memory: 1Gi
        limits:
          cpu: 1000m
          memory: 2Gi      

guardrails:
  enabled: true
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi  

entity-store:
  enabled: true
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 20Gi
      resources:
        requests:
          cpu: 500m
          memory: 1Gi
        limits:
          cpu: 1000m
          memory: 2Gi      

nemo-operator:
  enabled: true
  controllerManager:
    kubeRbacProxy:
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 250m
          memory: 256Mi
    manager:
      resources:
        requests:
          cpu: 1024m
          memory: 2Gi
        limits:
          cpu: 2048m
          memory: 4Gi

nim-operator:
  enabled: true
  operator:
    resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        cpu: 1000m
        memory: 1Gi

deployment-management:
  enabled: true
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi  

nim-proxy:
  enabled: true
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi
          
volcano:
  enabled: true
  custom:
    admission_enable: true
    admission_replicas: 1
    controller_enable: true
    controller_replicas: 1
    scheduler_enable: true
    scheduler_replicas: 1
    admission_resources:
      requests:
        cpu: 300m
        memory: 300Mi
      limits:
        cpu: 500m
        memory: 512Mi
    scheduler_resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        cpu: 1000m
        memory: 1Gi
    controller_resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        cpu: 1000m
        memory: 1Gi

# large
data-store:
  enabled: true
  persistence:
    enabled: true
    size: 100Gi
    storageClass: ""
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi  
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 100Gi
      resources:
        requests:
          cpu: 1000m
          memory: 2Gi
        limits:
          cpu: 2000m
          memory: 4Gi        

customizer:
  enabled: true
  modelsStorage:
    enabled: true
    size: 500Gi
    storageClassName: ""
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 100Gi
      resources:
        requests:
          cpu: 1000m
          memory: 2Gi
        limits:
          cpu: 2000m
          memory: 4Gi        

evaluator:
  enabled: true
  resources:
    requests:
      cpu: 4000m
      memory: 8Gi
    limits:
      cpu: 8000m
      memory: 16Gi   
  argoWorkflows:
    enabled: true
    crds:
      install: false   
    controller:
      resources:
        requests:
          cpu: 2000m
          memory: 4Gi
        limits:
          cpu: 4000m
          memory: 8Gi        
    server:
      resources:
        requests:
          cpu: 1000m
          memory: 2Gi
        limits:
          cpu: 2000m
          memory: 4Gi
  milvus:
    standalone:
      resources:
        requests:
          cpu: 2000m
          memory: 4Gi
        limits:
          cpu: 4000m
          memory: 8Gi      
      persistence:
        persistentVolumeClaim:
          storageClass: ""
          size: 200Gi
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 100Gi
      resources:
        requests:
          cpu: 1000m
          memory: 2Gi
        limits:
          cpu: 2000m
          memory: 4Gi      

guardrails:
  enabled: true
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi  

entity-store:
  enabled: true
  postgresql:
    primary:
      persistence:
        storageClass: "longhorn"
        size: 100Gi
      resources:
        requests:
          cpu: 1000m
          memory: 2Gi
        limits:
          cpu: 2000m
          memory: 4Gi      

nemo-operator:
  enabled: true
  controllerManager:
    kubeRbacProxy:
      resources:
        requests:
          cpu: 250m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 512Mi
    manager:
      resources:
        requests:
          cpu: 2048m
          memory: 4Gi
        limits:
          cpu: 4096m
          memory: 8Gi

nim-operator:
  enabled: true
  operator:
    resources:
      requests:
        cpu: 1000m
        memory: 1Gi
      limits:
        cpu: 2000m
        memory: 2Gi

deployment-management:
  enabled: true
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi  

nim-proxy:
  enabled: true
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi
          
volcano:
  enabled: true
  custom:
    admission_enable: true
    admission_replicas: 1
    controller_enable: true
    controller_replicas: 1
    scheduler_enable: true
    scheduler_replicas: 1
    admission_resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        cpu: 1000m
        memory: 1Gi
    scheduler_resources:
      requests:
        cpu: 1000m
        memory: 1Gi
      limits:
        cpu: 2000m
        memory: 2Gi
    controller_resources:
      requests:
        cpu: 1000m
        memory: 1Gi
      limits:
        cpu: 2000m
        memory: 2Gi
```

## nim/25.4.0

nim 카탈로그:

```yaml
nimService:
  name: "{{ .Name }}"
  existingAuthSecret: "$INFISICAL_SECRET"
  existingPVC: ""

  env:
    - name: NIM_PEFT_SOURCE
      value: http://nemo-entity-store.nemo:8000
    - name: NIM_SERVED_MODEL_NAME
      value: "$nimService.modelName"
    - name: NIM_MODEL_NAME
      value: "$nimService.modelName"
    - name: NIM_PEFT_REFRESH_INTERVAL
      value: "30"  

image:
  repository: "$image.repository"
  pullPolicy: IfNotPresent
  tag: "$image.tag"

imagePullSecrets:
  - name: nvcrimagepullsecret
    registry: nvcr.io
    username: "$oauthtoken"
    password: "$imagePullSecrets.password"
```

쿼터
```yaml
# small
nimService:
  resources:
    requests:
      cpu: 4000m
      memory: 8Gi
      nvidia.com/gpu: 1
    limits:
      cpu: 8000m
      memory: 16Gi
      nvidia.com/gpu: 1
  storage:
    pvc:
      storageClass: longhorn
      size: 20Gi

# medium
nimService:
  resources:
    requests:
      cpu: 8000m
      memory: 16Gi
      nvidia.com/gpu: 2
    limits:
      cpu: 16000m
      memory: 32Gi
      nvidia.com/gpu: 2
  storage:
    pvc:
      storageClass: longhorn
      size: 100Gi

# large
nimService:
  resources:
    requests:
      cpu: 16000m
      memory: 32Gi
      nvidia.com/gpu: 4
    limits:
      cpu: 32000m
      memory: 64Gi
      nvidia.com/gpu: 4
  storage:
    pvc:
      storageClass: longhorn
      size: 500Gi
```

## kserve/0.1.0

kserve 카탈로그:

```yaml
inferenceService:
  name: "{{ .Name }}"
  
  model:
    args:
      - --backend=vllm
      - --model_name=$model.name
      - --dtype=float16
    storageUri: "$model.volume"
  
  resources:
    limits:
      cpu: "8"
      memory: 16Gi
      nvidia.com/gpu: "1"
    requests:
      cpu: "4"
      memory: 8Gi
      nvidia.com/gpu: "1"

ingress:
  annotations:
    cert-manager.io/cluster-issuer: "root-ca-issuer"
  hosts: 
    - host: "{{ .Name }}-kserve.{{ .Namespace }}.{{ .Domain }}"
  tls:
    secretName: "{{ .Name }}-tls-secret"
```

쿼터
```yaml
# small
inferenceService:
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
      nvidia.com/gpu: "1"
    limits:
      cpu: 4000m
      memory: 8Gi
      nvidia.com/gpu: "1"

# medium
inferenceService:
  resources:
    requests:
      cpu: 4000m
      memory: 8Gi
      nvidia.com/gpu: "1"
    limits:
      cpu: 8000m
      memory: 16Gi
      nvidia.com/gpu: "2"

# large
inferenceService:
  resources:
    requests:
      cpu: 8000m
      memory: 16Gi
      nvidia.com/gpu: "2"
    limits:
      cpu: 16000m
      memory: 32Gi
      nvidia.com/gpu: "4"
```


## ragflow/0.20.1

ragflow 카탈로그:

```yaml
fullnameOverride: "{{ .Name }}"

env:
  DOC_ENGINE: infinity

  MYSQL_PASSWORD: "$env.mysqlPassword"
  MYSQL_DBNAME: rag_flow

  MINIO_ROOT_USER: rag_flow
  MINIO_PASSWORD: "$env.minioPassword"

  REDIS_PASSWORD: "$env.redisPassword"

  RAGFLOW_IMAGE: infiniflow/ragflow:v0.20.1-slim

  TIMEZONE: "Asia/Seoul"

  DOC_BULK_SIZE: 4

  EMBEDDING_BATCH_SIZE: 16

  REQUESTS_CA_BUNDLE: /tmp/ca.crt
  SSL_CERT_FILE: /tmp/ca.crt

ragflow:

  service_conf:
    oauth:
      oidc:
        display_name: "KEYCLOAK"
        client_id: "$KEYCLOAK_CLIENT_ID"
        client_secret: "$KEYCLOAK_CLIENT_SECRET"
        issuer: "$KEYCLOAK_URL/realms/$KEYCLOAK_REALM"
        scope: "openid email profile"
        redirect_uri: "https://{{ .Name }}.{{ .Domain }}/v1/user/oauth/callback/oidc"

  llm_factories:

  volumes:
    - name: keycloak-tls
      secret:
        secretName: keycloak-tls

  volumeMounts:
    - name: keycloak-tls
      mountPath: /tmp/ca.crt
      subPath: ca.crt
      readOnly: true  

  deployment:
    strategy:
    resources:
  service:
    type: ClusterIP
  api:
    service:
      enabled: true
      type: ClusterIP

infinity:
  image:
    repository: infiniflow/infinity
    tag: v0.6.0-dev5
  storage:
    className:
    capacity: 5Gi
  deployment:
    strategy:
    resources:
  service:
    type: ClusterIP

minio:
  image:
    repository: quay.io/minio/minio
    tag: RELEASE.2023-12-20T01-00-02Z
  storage:
    className:
    capacity: 5Gi
  deployment:
    strategy:
    resources:
  service:
    type: ClusterIP

mysql:
  image:
    repository: mysql
    tag: 8.0.39
  storage:
    className:
    capacity: 5Gi
  deployment:
    strategy:
    resources:
  service:
    type: ClusterIP

redis:
  image:
    repository: valkey/valkey
    tag: 8
  storage:
    className:
    capacity: 5Gi
  persistence:
    enabled: true
  deployment:
    strategy:
    resources:
  service:
    type: ClusterIP


ingress:
  enabled: true
  className: "kong"
  annotations: 
    cert-manager.io/cluster-issuer: root-ca-issuer
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
    konghq.com/https-redirect-status-code: '301'
    konghq.com/protocols: https
  hosts:
    - host: "{{ .Name }}.{{ .Domain }}"
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
   - secretName: "{{ .Name }}-tls-secret"
     hosts:
       - "{{ .Name }}.{{ .Domain }}"
```

쿼터
```yaml
# small
ragflow:
  deployment:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi

infinity:
  storage:
    className: "longhorn"
    capacity: 5Gi
  deployment:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi

minio:
  storage:
    className: "longhorn"
    capacity: 5Gi
  deployment:
    resources:
      requests:
        cpu: 200m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi

mysql:
  storage:
    className: "longhorn"
    capacity: 5Gi
  deployment:
    resources:
      requests:
        cpu: 250m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi

redis:
  storage:
    className: "longhorn"
    capacity: 5Gi
  deployment:
    resources:
      requests:
        cpu: 100m
        memory: 256Mi
      limits:
        cpu: 200m
        memory: 512Mi

# medium
ragflow:
  deployment:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi

infinity:
  storage:
    className: "longhorn"
    capacity: 20Gi
  deployment:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi

minio:
  storage:
    className: "longhorn"
    capacity: 50Gi
  deployment:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi

mysql:
  storage:
    className: "longhorn"
    capacity: 20Gi
  deployment:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi

redis:
  storage:
    className: "longhorn"
    capacity: 10Gi
  deployment:
    resources:
      requests:
        cpu: 200m
        memory: 512Mi
      limits:
        cpu: 500m
        memory: 1Gi

# large
ragflow:
  deployment:
    resources:
      requests:
        cpu: 2000m
        memory: 4Gi
      limits:
        cpu: 4000m
        memory: 8Gi

infinity:
  storage:
    className: "longhorn"
    capacity: 100Gi
  deployment:
    resources:
      requests:
        cpu: 2000m
        memory: 4Gi
      limits:
        cpu: 4000m
        memory: 8Gi

minio:
  storage:
    className: "longhorn"
    capacity: 200Gi
  deployment:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi

mysql:
  storage:
    className: "longhorn"
    capacity: 100Gi
  deployment:
    resources:
      requests:
        cpu: 1000m
        memory: 2Gi
      limits:
        cpu: 2000m
        memory: 4Gi

redis:
  storage:
    className: "longhorn"
    capacity: 50Gi
  deployment:
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi
```

## starrocks-operator/0.11.0

starrocks-operator 카탈로그:

```yaml
timeZone: Asia/Seoul

image:
  repository: starrocks/operator
  tag: "v1.11.0"
  pullPolicy: IfNotPresent

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 500m
    memory: 400Mi

nodeSelector:
  kubernetes.io/os: linux

tolerations: []

affinity: {}

webhook:
  enabled: true
  port: 9443
  certManager:
    enabled: false

metrics:
  enabled: true
  port: 8080
  serviceMonitor:
    enabled: false
```

쿼터
```yaml
# small
starrocksOperator:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi  
    limits:
      cpu: 1000m
      memory: 2Gi

# medium
starrocksOperator:
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi  
    limits:
      cpu: 2000m
      memory: 4Gi

# large
starrocksOperator:
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi  
    limits:
      cpu: 4000m
      memory: 8Gi
```

## starrocks/0.11.0

starrocks 카탈로그:

```yaml
initPassword:
  enabled: true
  password: ""
  passwordSecret: "$INFISICAL_SECRET"

timeZone: Asia/Seoul

starrocksCluster:
  enabledBe: false
  enabledCn: true

starrocksFESpec:
  replicas: 3
  runAsNonRoot: "false"
  service:
    type: ClusterIP
  resources:
    requests:
      cpu: 300m
      memory: 1Gi
    limits:
      cpu: 2
      memory: 4Gi  
  storageSpec:
    name: fe
    storageClassName: "longhorn"
    storageSize: 10Gi
    logStorageSize: 5Gi
  
  nodeSelector: {}
  affinity: {}
  tolerations: []
  
  config: |
    run_mode = shared_data
    cloud_native_storage_type = S3
    aws_s3_endpoint = $starrocksFESpec.config.endpoint

    aws_s3_path = $starrocksFESpec.config.path

    aws_s3_access_key = $starrocksFESpec.config.accesskey
    aws_s3_secret_key = $starrocksFESpec.config.secretkey
    aws_s3_use_instance_profile = false
    aws_s3_use_aws_sdk_default_behavior = false

    enable_load_volume_from_conf = true


starrocksCnSpec:
  replicas: 3
  runAsNonRoot: "false"
  resources:
    requests:
      cpu: 300m
      memory: 2Gi
    limits:
      cpu: 2
      memory: 4Gi  
  storageSpec:
    name: be 
    storageClassName: "longhorn"
    storageSize: 15Gi
    logStorageSize: 10Gi
  nodeSelector: {}
  affinity: {}
  tolerations: []
  autoScalingPolicy: {}


starrocksFeProxySpec:
  enabled: true
  resolver: "rke2-coredns-rke2-coredns.kube-system.svc.cluster.local"
  service:
    type: ClusterIP
```

쿼터
```yaml
# small
starrocksCluster:
  enabledBe: false
  enabledCn: true

starrocksFESpec:
  replicas: 3
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi
  storageSpec:
    name: fe
    storageClassName: "longhorn"
    storageSize: 10Gi
    logStorageSize: 5Gi

starrocksCnSpec:
  replicas: 3
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi
  storageSpec:
    name: cn
    storageClassName: "longhorn"
    storageSize: 100Gi
    logStorageSize: 20Gi
    spillStorageSize: 10Gi
  autoScalingPolicy:
    minReplicas: 1
    maxReplicas: 10

starrocksFeProxySpec:
  enabled: true
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi

# medium
starrocksCluster:
  enabledBe: false
  enabledCn: true

starrocksFESpec:
  replicas: 3
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi
  storageSpec:
    name: fe
    storageClassName: "longhorn"
    storageSize: 50Gi
    logStorageSize: 20Gi

starrocksCnSpec:
  replicas: 3
  resources:
    requests:
      cpu: 4000m
      memory: 8Gi
    limits:
      cpu: 8000m
      memory: 16Gi
  storageSpec:
    name: cn
    storageClassName: "longhorn"
    storageSize: 1Ti
    logStorageSize: 100Gi
    spillStorageSize: 50Gi
  autoScalingPolicy:
    minReplicas: 1
    maxReplicas: 10

starrocksFeProxySpec:
  enabled: true
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi

# large
starrocksCluster:
  enabledBe: false
  enabledCn: true

starrocksFESpec:
  replicas: 3
  resources:
    requests:
      cpu: 4000m
      memory: 8Gi
    limits:
      cpu: 8000m
      memory: 16Gi
  storageSpec:
    name: fe
    storageClassName: "longhorn"
    storageSize: 200Gi
    logStorageSize: 100Gi

starrocksCnSpec:
  replicas: 3
  resources:
    requests:
      cpu: 8000m
      memory: 16Gi
    limits:
      cpu: 16000m
      memory: 32Gi
  storageSpec:
    name: cn
    storageClassName: "longhorn"
    storageSize: 10Ti
    logStorageSize: 500Gi
    spillStorageSize: 200Gi
  autoScalingPolicy:
    minReplicas: 1
    maxReplicas: 10

starrocksFeProxySpec:
  enabled: true
  resources:
    requests:
      cpu: 2000m
      memory: 4Gi
    limits:
      cpu: 4000m
      memory: 8Gi
```

## strimzi-kafka-operator/0.47.0

kafka operator 카탈로그:

```yaml
defaultImageRegistry: "quay.io"
defaultImageRepository: "strimzi"
defaultImageTag: "0.47.0"

replicas: 1
watchNamespaces: []
watchAnyNamespace: true

logLevel: INFO
logConfiguration: ""

fullReconciliationIntervalMs: 120000
operationTimeoutMs: 300000

resources:
  limits:
    memory: 384Mi
    cpu: 1000m
  requests:
    memory: 384Mi
    cpu: 200m

extraEnvs: []    
```

쿼터
```yaml
# small
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 1000m
    memory: 2Gi

# medium
resources:
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 2000m
    memory: 4Gi

# large
resources:
  requests:
    cpu: 2000m
    memory: 4Gi
  limits:
    cpu: 4000m
    memory: 8Gi
```

## kafka-ui/1.5.1

kafka ui 카탈로그:

```yaml
image:
  registry: docker.io
  repository: wbsong111/kafka-ui
  tag: "v1.3.0"
  pullPolicy: IfNotPresent
yamlApplicationConfig:
  kafka:
    clusters:
    - name: kafka-cluster
      bootstrapServers: SASL_PLAINTEXT://kafka-cluster-kafka-tls-bootstrap.$kafka_cluster_namespace.svc.cluster.local:9093
      properties:
        security.protocol: SASL_PLAINTEXT
        sasl.mechanism: OAUTHBEARER
        sasl.jaas.config: |
          org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required 
          oauth.token.endpoint.uri="$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/protocol/openid-connect/token" 
          oauth.client.id="$KAFKA_CLIENT_ID" 
          oauth.client.secret="$KAFKA_CLIENT_SECRET"
          oauth.ssl.truststore.location="/etc/kafka/secrets/truststore.jks"
          oauth.ssl.truststore.password="kafka";
        sasl.login.callback.handler.class: "io.strimzi.kafka.oauth.client.JaasClientOauthLoginCallbackHandler"
  auth:
    type: disabled

  management:
    health:
      ldap:
        enabled: false

volumes:
  - name: truststore
    secret:
      secretName: truststore

volumeMounts:
  - name: truststore
    mountPath: /etc/kafka/secrets
    readOnly: true 

ingress:
  enabled: true
  annotations:
    cert-manager.io/cluster-issuer: "root-ca-issuer"
    cert-manager.io/duration: 8760h
    cert-manager.io/renew-before: 720h
    kubernetes.io/ingress.class: kong
    konghq.com/protocols: https
    konghq.com/https-redirect-status-code: "301"
    konghq.com/plugins: oidc-plugin, keycloak-authz-plugin
  host: "{{ .Name }}.{{ .Domain }}"
  tls:
    enabled: true
    secretName: "{{ .Name }}-tls-secret"
```

쿼터
```yaml
# small
resources:
  requests:
    cpu: 200m
    memory: 512Mi
  limits:
    cpu: 500m
    memory: 1Gi

# medium
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 1000m
    memory: 2Gi

# large
resources:
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 2000m
    memory: 4Gi
```

## kafka-cluster/1.0.0

kafka cluster 카탈로그:

```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaNodePool
metadata:
  name: controller
  namespace: "{{ .Namespace }}"
  labels:
    strimzi.io/cluster: "{{ .Name }}"
spec:
  replicas: 3
  roles:
    - controller
  storage:
    type: jbod
    volumes:
      - id: 0
        type: persistent-claim
        size: 50Gi
        kraftMetadata: shared
        class: longhorn
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaNodePool
metadata:
  name: broker
  namespace: "{{ .Namespace }}"
  labels:
    strimzi.io/cluster: "{{ .Name }}"
spec:
  replicas: 3
  roles:
    - broker
  storage:
    type: jbod
    volumes:
      - id: 0
        type: persistent-claim
        size: 50Gi
        class: longhorn
        kraftMetadata: shared
---
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: "{{ .Name }}"
  namespace: "{{ .Namespace }}"
  annotations:
    strimzi.io/node-pools: enabled
    strimzi.io/kraft: enabled
spec:
  kafka:
    version: 4.0.0
    metadataVersion: "4.0"
    template:
      kafkaContainer:
        env:
        - name: KAFKA_OPTS
          value: "-Duser.timezone=Asia/Seoul"
    listeners:
      - name: tls
        type: cluster-ip
        port: 9093
        tls: false
        authentication:
          type: oauth
          clientId: "$KEYCLOAK_CLIENT_ID"
          clientSecret:
            key: client-secret
            secretName: kafka-cluster-oauth-secret
          checkIssuer: true
          checkAccessTokenType: true
          accessTokenIsJwt: true
          checkAudience: false
          enableOauthBearer: true
          validIssuerUri: $KEYCLOAK_URL/realms/$KEYCLOAK_REALM
          jwksEndpointUri: $KEYCLOAK_URL/realms/$KEYCLOAK_REALM/protocol/openid-connect/certs
          userNameClaim: preferred_username
          customClaimCheck: '''$KEYCLOAK_CLIENT_ID'' in @.realm_access.roles'
          tlsTrustedCertificates:
            - secretName: keycloak-tls
              certificate: ca.crt
    config:
      offsets.topic.replication.factor: 3
      transaction.state.log.replication.factor: 3
      transaction.state.log.min.isr: 2
      default.replication.factor: 3
      min.insync.replicas: 2
      auto.create.topics.enable: false
      num.partitions: 3
      delete.topic.enable: true
    authorization:
      type: simple
    logging:
      type: inline
      loggers:
        kafka.root.logger.level: INFO
  entityOperator:
    topicOperator: { }
    userOperator: { }

---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaConnect
metadata:
  name: "{{ .Name }}"
  namespace: "{{ .Namespace }}"
  labels:
    strimzi.io/cluster: "{{ .Name }}"
  annotations:
    strimzi.io/use-connector-resources: 'true'
spec:
  image: paasup/kafka-connect:0.2
  replicas: 1
  bootstrapServers: "kafka-cluster-kafka-tls-bootstrap.{{ .Namespace }}.svc.cluster.local:9093"
  config:
    group.id: "{{ .Name }}-default-connect"
    offset.storage.topic: "{{ .Name }}.connect-offsets"
    config.storage.topic: "{{ .Name }}.connect-configs"
    status.storage.topic: "{{ .Name }}.connect-status"
    key.converter: org.apache.kafka.connect.json.JsonConverter
    value.converter: org.apache.kafka.connect.json.JsonConverter
    plugin.path: /opt/kafka/plugins
    topic.creation.enable: "true"
  authentication:
    type: oauth
    tokenEndpointUri: $KEYCLOAK_URL/realms/$KEYCLOAK_REALM/protocol/openid-connect/token
    clientId: "$KEYCLOAK_CLIENT_ID-kafka-connect"
    clientSecret:
      secretName: kafka-connect-oauth-secret
      key: client-secret
    tlsTrustedCertificates:
      - secretName: keycloak-tls
        pattern: "ca.crt"

  template:
    connectContainer:
      volumeMounts:
        - name: truststore-volume
          mountPath: /mnt/truststore/truststore.jks
          subPath: truststore.jks
          readOnly: true
    pod:
      volumes:
        - name: truststore-volume
          secret:
            secretName: truststore

  logging:
    type: inline
    loggers:
      rootLogger.level: INFO

---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaUser
metadata:
  name: service-account-$KEYCLOAK_CLIENT_ID-kafka-connect
  namespace: "{{ .Namespace }}"
  labels:
    strimzi.io/cluster: "{{ .Name }}"
spec:
  authorization:
    type: simple
    acls:
      - resource:
          type: topic
          name: "*"
          patternType: literal
        operations:
          - Read
          - Describe
          - DescribeConfigs
          - Write
      - resource:
          type: group
          name: "*"
          patternType: literal
        operations:
          - Read
          - Write
          - Describe     

---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  labels:
    strimzi.io/cluster: kafka-cluster
  name: "{{ .Name }}-connect-offsets"
  namespace: "{{ .Namespace }}"
spec:
  partitions: 1
  replicas: 3
  topicName: "{{ .Name }}.connect-offsets"
  config:
    cleanup.policy: compact
    retention.ms: 604800000
    segment.bytes: 1073741824

---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  labels:
    strimzi.io/cluster: kafka-cluster
  name: "{{ .Name }}-connect-configs"
  namespace: "{{ .Namespace }}"
spec:
  partitions: 1
  replicas: 3
  topicName: "{{ .Name }}.connect-configs"
  config:
    cleanup.policy: compact
    retention.ms: 604800000
    segment.bytes: 1073741824

---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  labels:
    strimzi.io/cluster: kafka-cluster
  name: "{{ .Name }}-connect-status"
  namespace: "{{ .Namespace }}"
spec:
  partitions: 1
  replicas: 3
  topicName: "{{ .Name }}.connect-status"
  config:
    cleanup.policy: compact
    retention.ms: 604800000
    segment.bytes: 1073741824
```

쿼터
```yaml
# small


# medium


# large

```

## kafka/1.0.0

kafka user 카탈로그:

```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaUser
metadata:
  name: "service-account-{{ .ClusterName }}-{{ .ClusterProjectName }}-kafka-common"
  labels:
    strimzi.io/cluster: $kafka_cluster_namespace
spec:
  authorization:
    type: simple
    acls:
      - resource:
          type: topic
          name: "{{ .ClusterProjectName }}."
          patternType: prefix
        operations:
          - Read
          - Describe
          - DescribeConfigs
          - Write
      - resource:
          type: group
          name: "{{ .ClusterProjectName }}-"
          patternType: prefix
        operations:
          - Read
          - Write
          - Describe

{{- $clusterCatalog := . -}}
{{range index .QuestionsMap "$topicName"}}
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  labels:
    strimzi.io/cluster: $kafka_cluster_namespace
  name: "{{replaceDotUnderToHypen .}}"
  namespace: $kafka_cluster_namespace
spec:
  partitions: $topic.partition
  replicas: 3
  topicName: "{{ $clusterCatalog.ClusterProjectName }}.{{.}}"
  config:
    cleanup.policy: compact
    retention.bytes: "$topic.retention"
    segment.bytes: "$topic.segment"
{{end}}
```

쿼터
```yaml
# small


# medium


# large

```

## kafka-connector/1.0.0

kafka connector 카탈로그:

```yaml
{{if .ShowIf}}
{{if eq (index .ShowIf "postgresql.source") "true"}}
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaConnector
metadata:
  name: "{{ .Name }}-kafka-postgresql"
  namespace: $kafka_cluster_namespace
  labels:
    strimzi.io/cluster: $kafka_cluster_namespace
spec:
  class: io.debezium.connector.postgresql.PostgresConnector
  tasksMax: 6
  config:
    database.hostname: "$database.host"
    database.port: "5432"
    database.user: "$database.user"
    database.password: "$database.password"
    database.dbname: "$database.db"
    table.include.list: "$database.table.include"
    plugin.name: pgoutput
    snapshot.mode: "initial"
    slot.name: "$database.slot"
    publication.autocreate.mode: filtered
    topic.prefix: "{{ .ClusterProjectName }}"
    producer.override.security.protocol: "SASL_PLAINTEXT"
    producer.override.sasl.mechanism: "OAUTHBEARER"
    producer.override.sasl.jaas.config: |
      org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required
        oauth.token.endpoint.uri="$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/protocol/openid-connect/token"
        oauth.client.id="$KAFKA_CLIENT_ID"
        oauth.client.secret="$KAFKA_CLIENT_SECRET"
        oauth.ssl.truststore.location="/mnt/truststore/truststore.jks" 
        oauth.ssl.truststore.password="kafka";
{{end}}

{{if eq (index .ShowIf "s3.target") "true"}}
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaConnector
metadata:
  name: "{{ .Name }}-kafka-s3"
  namespace: $kafka_cluster_namespace
  labels:
    strimzi.io/cluster: $kafka_cluster_namespace
spec:
  class: io.confluent.connect.s3.S3SinkConnector
  tasksMax: 6
  config:
    topics: "{{ .ClusterProjectName }}.$config.topics"
    store.url: "$s3.url"
    s3.region: us-east-1
    aws.access.key.id: "$s3.accesskey"
    aws.secret.access.key: "$s3.secretkey"
    s3.bucket.name: "$s3.bucket"
    s3.part.size: 5242880
    flush.size: 3
    format.class: io.confluent.connect.s3.format.json.JsonFormat
    storage.class: io.confluent.connect.s3.storage.S3Storage
    schema.compatibility: NONE
    consumer.override.security.protocol: "SASL_PLAINTEXT"
    consumer.override.sasl.mechanism: "OAUTHBEARER"
    consumer.override.sasl.jaas.config: |
      org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required
        oauth.token.endpoint.uri="$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/protocol/openid-connect/token"
        oauth.client.id="$KAFKA_CLIENT_ID"
        oauth.client.secret="$KAFKA_CLIENT_SECRET"
        oauth.ssl.truststore.location="/mnt/truststore/truststore.jks" 
        oauth.ssl.truststore.password="kafka";    
{{end}}

{{if eq (index .ShowIf "star.target") "true"}}
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaConnector
metadata:
  name: "{{ .Name }}-kafka-starrocks"
  namespace: $kafka_cluster_namespace
  labels:
    strimzi.io/cluster: $kafka_cluster_namespace
spec:
  class: com.starrocks.connector.kafka.StarRocksSinkConnector
  tasksMax: 6
  config:
    topics: "{{ .ClusterProjectName }}.$star.config.topics"
    starrocks.http.url: kube-starrocks-fe-service.$star.namespace.svc.cluster.local:8030
    starrocks.database.name: "$star.database.name"
    starrocks.username: "$star.username"
    starrocks.password: "$star.password"
    sink.properties.strip_outer_array: true
    connect.timeoutms: "30000"
    starrocks.topic2table.map: "$star.topic2table"
    transforms: addfield,unwrap
    transforms.addfield.type: com.starrocks.connector.kafka.transforms.AddOpFieldForDebeziumRecord
    transforms.unwrap.type: io.debezium.transforms.ExtractNewRecordState
    transforms.unwarp.drop.tombstones: true
    transforms.unwarp.delete.handling.mode: rewrite 
{{end}}

{{if eq (index .ShowIf "starjson.target") "true"}}
---
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaConnector
metadata:
  name: "{{ .Name }}-kafka-starrocks"
  namespace: $kafka_cluster_namespace
  labels:
    strimzi.io/cluster: $kafka_cluster_namespace
spec:
  class: com.starrocks.connector.kafka.StarRocksSinkConnector
  tasksMax: 6
  config:
    topics: "{{ .ClusterProjectName }}.$starjson.config.topics"
    starrocks.http.url: kube-starrocks-fe-service.$starjson.namespace.svc.cluster.local:8030
    starrocks.database.name: "$starjson.database.name"
    starrocks.username: "$starjson.username"
    starrocks.password: "$starjson.password"
    sink.properties.strip_outer_array: true
    connect.timeoutms: "30000"
    starrocks.topic2table.map: "$starjson.topic2table"
    key.converter: "org.apache.kafka.connect.json.JsonConverter"
    value.converter: "org.apache.kafka.connect.json.JsonConverter"
    key.converter.schemas.enable: "true"
    value.converter.schemas.enable: "false"
{{end}}
{{end}}
```

쿼터
```yaml
# small


# medium


# large

```