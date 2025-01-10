"use strict";(self.webpackChunkpaasup=self.webpackChunkpaasup||[]).push([[976],{2053:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"intro","title":"\uce74\ud0c8\ub85c\uadf8 \uc124\uc815\uac12","description":"Gitea \uc2dc\uc2a4\ud15c \uce74\ud0c8\ub85c\uadf8","source":"@site/docs/intro.md","sourceDirName":".","slug":"/intro","permalink":"/guide/docs/intro","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar","next":{"title":"\uc124\uce58","permalink":"/guide/docs/category/\uc124\uce58"}}');var a=s(4848),t=s(8453);const i={sidebar_position:1},o="\uce74\ud0c8\ub85c\uadf8 \uc124\uc815\uac12",l={},c=[{value:"Gitea \uc2dc\uc2a4\ud15c \uce74\ud0c8\ub85c\uadf8",id:"gitea-\uc2dc\uc2a4\ud15c-\uce74\ud0c8\ub85c\uadf8",level:2},{value:"Argocd \uc2dc\uc2a4\ud15c \uce74\ud0c8\ub85c\uadf8",id:"argocd-\uc2dc\uc2a4\ud15c-\uce74\ud0c8\ub85c\uadf8",level:2},{value:"Gitea",id:"gitea",level:2},{value:"MLflow",id:"mlflow",level:2},{value:"Kubeflow",id:"kubeflow",level:2},{value:"Rancher",id:"rancher",level:2},{value:"rancher-monitoring-crd",id:"rancher-monitoring-crd",level:2},{value:"rancher-monitoring",id:"rancher-monitoring",level:2},{value:"spark-operator",id:"spark-operator",level:2},{value:"qdrant",id:"qdrant",level:2},{value:"langflow-ide",id:"langflow-ide",level:2},{value:"superset",id:"superset",level:2},{value:"ollama",id:"ollama",level:2},{value:"flowise",id:"flowise",level:2}];function m(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"\uce74\ud0c8\ub85c\uadf8-\uc124\uc815\uac12",children:"\uce74\ud0c8\ub85c\uadf8 \uc124\uc815\uac12"})}),"\n",(0,a.jsx)(n.h2,{id:"gitea-\uc2dc\uc2a4\ud15c-\uce74\ud0c8\ub85c\uadf8",children:"Gitea \uc2dc\uc2a4\ud15c \uce74\ud0c8\ub85c\uadf8"}),"\n",(0,a.jsx)(n.p,{children:"Gitea \uc2dc\uc2a4\ud15c \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.p,{children:"\uc678\ubd80 DB \ucc38\uc870\uc870"}),"\n",(0,a.jsx)(n.p,{children:"\uc544\ub798 \ud56d\ubaa9\uc740 \uc0ac\uc774\ud2b8\uc5d0 \ub530\ub77c \uc218\uc815\uc774 \ud544\uc694\ud569\ub2c8\ub2e4."}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"password"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'global:\n  imageRegistry: ""\n\ningress:\n  enabled: true\n  annotations:\n    kubernetes.io/ingress.class: nginx\n    nginx.ingress.kubernetes.io/proxy-body-size: 200m\n    cert-manager.io/cluster-issuer: "selfsigned-issuer" \n    cert-manager.io/duration: 8760h  \n    cert-manager.io/renew-before: 720h\n  hosts:\n    - host: gitea.{{ .Domain }}\n      paths:\n        - path: /\n          pathType: Prefix\n  tls:\n    - hosts:\n        host: gitea.{{ .Domain }}\n      secretName: platform\n\nextraVolumes:\n - name: gitea-tls\n   secret:\n     secretName: platform\n\nextraContainerVolumeMounts:\n  - name: gitea-tls\n    mountPath: /data/gitea/https\n\nlifecycleHooks:\n  postStart:\n    exec:\n      command: ["/bin/sh", "-c", "cp /data/gitea/https/tls.crt /usr/local/share/ca-certificates/; update-ca-certificates"]\n\n\nreplicaCount: 1\n\ntolerations: []\n\nnodeSelector: {}\n\nresources:\n  requests:\n    cpu: 100m\n    memory: 300Mi\n  limits:\n    cpu: 300m\n    memory: 500Mi\n\npersistence:\n  enabled: true\n  size: 10Gi\n  storageClass: ""\n\n\ngitea:\n  admin:   \n    username: sudouser\n    password: password\n    email: "sudouser@cro.com"\n  config:\n    APP_NAME: paasup git\n    RUN_MODE: prod\n    server:\n      ROOT_URL: https://gitea.{{ .Domain }}\n    database:\n      DB_TYPE: postgres\n      HOST: postgresql-ha-postgresql:5432\n      NAME: gitea\n      USER: gitea\n      PASSWD: gitea\n      CHARSET: utf8\n      SCHEMA: gitea\n      SSL_MODE: disable\n    session:\n      PROVIDER: postgres\n      PROVIDER_CONFIG: user=gitea password=gitea host=postgresql-ha-postgresql port=5432 dbname=gitea sslmode=disable\n      COOKIE_NAME: i_hate_gitea\n    service:\n      DEFAULT_ALLOW_CREATE_ORGANIZATION: true\n    repository:\n      DEFAULT_BRANCH: master\n'})}),"\n",(0,a.jsx)(n.h2,{id:"argocd-\uc2dc\uc2a4\ud15c-\uce74\ud0c8\ub85c\uadf8",children:"Argocd \uc2dc\uc2a4\ud15c \uce74\ud0c8\ub85c\uadf8"}),"\n",(0,a.jsx)(n.p,{children:"Argocd \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'server:\n  ingress:\n    enabled: true\n    annotations:\n      nginx.ingress.kubernetes.io/rewrite-target: /\n      nginx.ingress.kubernetes.io/force-ssl-redirect: "true"\n      nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"\n    ingressClassName: "nginx"\n    hostname: "argocd.{{ .Domain }}"\n    extraTls:\n      - hosts:\n        - argocd.{{ .Domain }}\n        secretName: platform\n'})}),"\n",(0,a.jsx)(n.h2,{id:"gitea",children:"Gitea"}),"\n",(0,a.jsx)(n.p,{children:"Gitea \uc77c\ubc18 \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.p,{children:"DB \ub0b4\uc7a5\uc7a5"}),"\n",(0,a.jsx)(n.p,{children:"\uc544\ub798 \ud56d\ubaa9\uc740 \uc0ac\uc774\ud2b8\uc5d0 \ub530\ub77c \uc218\uc815\uc774 \ud544\uc694\ud569\ub2c8\ub2e4."}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"password"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'global:\n  imageRegistry: ""\n\ningress:\n  enabled: true\n  annotations:\n    kubernetes.io/ingress.class: nginx\n    nginx.ingress.kubernetes.io/proxy-body-size: 200m\n    cert-manager.io/cluster-issuer: "selfsigned-issuer" \n    cert-manager.io/duration: 8760h  \n    cert-manager.io/renew-before: 720h\n  hosts:\n    - host: {{ .Name }}.{{ .Domain }}\n      paths:\n        - path: /\n          pathType: Prefix\n  tls:\n    - hosts:\n        host: {{ .Name }}.{{ .Domain }}\n      secretName: {{ .Name }}-tls-secret\n\nextraVolumes:\n - name: keycloak-tls\n   secret:\n     secretName: keycloak-tls-secret\n\n\nextraContainerVolumeMounts:\n  - name: keycloak-tls\n    mountPath: /etc/ssl/certs/ca.crt\n    subPath: ca.crt\n\nlifecycleHooks:\n  postStart:\n    exec:\n      command: \n      - "/bin/sh"\n      -  "-c"\n      - |\n        POST_START\n\nreplicaCount: 1\n\nresources:\n  requests:\n    cpu: 100m\n    memory: 300Mi\n  limits:\n    cpu: 300m\n    memory: 500Mi\n\npersistence:\n  enabled: true\n  size: 10Gi\n  storageClass: "longhorn"\n\ngitea:\n  admin:   \n    username: sudouser\n    password: password\n    email: "sudouser@cro.com"\n  config:\n    APP_NAME: paasup git\n    RUN_MODE: prod\n    server:\n      ROOT_URL: https://{{ .Name }}.{{ .Domain }}\n    database:\n      DB_TYPE: postgres\n      HOST: {{ .Name }}-postgresql:5432\n      NAME: gitea\n      USER: gitea\n      PASSWD: gitea\n      CHARSET: utf8\n      SSL_MODE: disable\n    service:\n      DEFAULT_ALLOW_CREATE_ORGANIZATION: true\n    repository:\n      DEFAULT_BRANCH: master\n\npostgresql:\n  enabled: true\n  global:\n    postgresql:\n      postgresqlDatabase: gitea\n      postgresqlUsername: gitea\n      postgresqlPassword: gitea\n      servicePort: 5432\n  persistence:\n    size: 5Gi\n'})}),"\n",(0,a.jsx)(n.h2,{id:"mlflow",children:"MLflow"}),"\n",(0,a.jsx)(n.p,{children:"Mlflow \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.p,{children:"\uc678\ubd80 minio \uc0ac\uc6a9\ud560 \ub54c"}),"\n",(0,a.jsx)(n.p,{children:"\uc544\ub798 \ud56d\ubaa9\uc740 \uc0ac\uc774\ud2b8\uc5d0 \ub530\ub77c \uc218\uc815\uc774 \ud544\uc694\ud569\ub2c8\ub2e4."}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"password"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'tracking:\n  auth:\n    username: mlflow\n    password: password\n  service:\n    type: ClusterIP\n  ingress:\n    enabled: true\n    pathType: ImplementationSpecific\n    hostname: {{ .Name }}.{{ .Domain }}\n    ingressClassName: "nginx"\n    annotations:\n      nginx.ingress.kubernetes.io/proxy-body-size: 2048m\n      cert-manager.io/cluster-issuer: "selfsigned-issuer" \n      cert-manager.io/duration: 8760h  \n      cert-manager.io/renew-before: 720h\n    path: /\n    tls: false\n    extraTls:\n    - hosts:\n        - {{ .Name }}.{{ .Domain }}\n      secretName: {{ .Name }}-tls-secret\n  extraArgs:\n    - "--gunicorn-opts=--timeout 600"\npostgresql:\n  auth:\n    username: mlflow\n    password: mlflow\nminio:\n  enabled: false\nexternalS3:\n  host: "minio.stg.paasup.io"\n  port: 443\n  useCredentialsInSecret: true\n  accessKeyID: "{{ .AccessKey }}"\n  accessKeySecret: "{{ .SecretKey }}"\n  protocol: "https"\n  bucket: "{{ .Path }}"\n  serveArtifacts: true\n'})}),"\n",(0,a.jsx)(n.h2,{id:"kubeflow",children:"Kubeflow"}),"\n",(0,a.jsx)(n.p,{children:"Kubeflow \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'apiVersion: kubeflow.org/v1\nkind: Profile\nmetadata:\n  name: {{ .Namespace }}\nspec:\n  owner:\n    kind: User\n    name: {{ .Email }}\n  resourceQuotaSpec:\n    hard:\n      cpu: "4"\n      memory: 2Gi\n      persistentvolumeclaims: "4"\n'})}),"\n",(0,a.jsx)(n.h2,{id:"rancher",children:"Rancher"}),"\n",(0,a.jsx)(n.p,{children:"Rancher \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'hostname: {{ .Name }}.{{ .Domain }}\ningress:\n  enable: true\n  tls:\n    source: secret\n    secretName: rancher-tls-ingress\n  extraAnnotations:    \n    nginx.ingress.kubernetes.io/proxy-body-size: 10m\n    cert-manager.io/cluster-issuer: "selfsigned-issuer" \n    cert-manager.io/duration: 8760h  \n    cert-manager.io/renew-before: 720h\n\nprivateCA: true\n\nreplicas: 1\n\ntolerations: []\n\nnodeSelector: {}\n\nresources: \n  requests:\n    cpu: 100m\n    memory: 500Mi\n  limits:\n    cpu: 1000m\n    memory: 1000Mi\n\nextraEnv:\n- name: TZ\n  value: Asia/Seoul\n\npreinstallHook: true\n\nnewPassword: rancherPassword1!\n'})}),"\n",(0,a.jsx)(n.h2,{id:"rancher-monitoring-crd",children:"rancher-monitoring-crd"}),"\n",(0,a.jsx)(n.p,{children:"rancher-monitoring-crd \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"---\n"})}),"\n",(0,a.jsx)(n.h2,{id:"rancher-monitoring",children:"rancher-monitoring"}),"\n",(0,a.jsx)(n.p,{children:"rancher-monitoring \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:"grafana:\n  resources:\n    requests:\n      cpu: 100m\n      memory: 100Mi\n    limits:\n      cpu: 200m\n      memory: 200Mi\n\nprometheus:\n  prometheusSpec:\n    resources:\n      requests:\n        cpu: 250m\n        memory: 100Mi\n      limits:\n        cpu: 1000m\n        memory: 2000Mi\n    scrapeInterval: 1m\n    evaluationInterval: 1m\n    retention:  30d\n    retentionSize: 10GB\n    storageSpec:\n      volumeClaimTemplate:\n        spec:\n          accessModes:\n          - ReadWriteOnce\n          resources:\n            requests:\n              storage: 10Gi\n          storageClassName: longhorn\n          volumeMode: Filesystem\n\nalertmanager:\n  alertmanagerSpec:\n    resources:\n      requests:\n        cpu: 100m\n        memory: 100Mi\n      limits:\n        cpu: 1000m\n        memory: 500Mi\n"})}),"\n",(0,a.jsx)(n.h2,{id:"spark-operator",children:"spark-operator"}),"\n",(0,a.jsx)(n.p,{children:"spark-operator \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'image:\n  registry: docker.io\n  repository: kubeflow/spark-operator\n  tag: "2.0.2"\n  \ncontroller:\n  workers: 10\n  \n  logLevel: info\n  \n  uiService:\n    enable: true\n  uiIngress:\n    enable: true\n    urlFormat: "{{ .Name }}.{{ .Domain }}/{{`{{$appNamespace}}`}}/{{`{{$appName}}`}}"\n\n  resources:\n    limits:\n      cpu: 100m\n      memory: 300Mi\n    requests:\n      cpu: 100m\n      memory: 300Mi\n\n\n  workqueueRateLimiter:\n    bucketQPS: 50\n    bucketSize: 500\n    maxDelay:\n      enable: true\n      duration: 6h\n\nwebhook:\n  resources:\n    limits:\n      cpu: 100m\n      memory: 300Mi\n    requests:\n      cpu: 100m\n      memory: 300Mi\n\nspark:\n  jobNamespaces: []\n'})}),"\n",(0,a.jsx)(n.h2,{id:"qdrant",children:"qdrant"}),"\n",(0,a.jsx)(n.p,{children:"qdrant \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'images:\n  repository: docker.io/qdrant/qdrant\n  tag: v1.12.4\n\nreplicaCount: 1\n\nnodeSelector: {}\ntolerations: []\nresources: {}\n\n\npersistence:\n  accessModes: ["ReadWriteOnce"]\n  size: 10Gi\n  storageClassName: ""\n\n\nconfig:\n  log_level: INFO\n  cluster:\n    enabled: true\n    p2p:\n      port: 6335\n    consensus:\n      tick_period_ms: 100\n\n\napiKey: false\nreadOnlyApiKey: false\n\n\ningress:\n  enabled: true\n  annotations:\n    cert-manager.io/cluster-issuer: "selfsigned-issuer" \n    cert-manager.io/duration: 8760h  \n    cert-manager.io/renew-before: 720h\n  hosts:\n  - host: {{ .Name }}.{{ .Domain }}\n    paths:\n    - path: /\n      pathType: Prefix\n      servicePort: 6333\n  tls: \n  -  hosts:\n     - {{ .Name }}.{{ .Domain }}\n     secretName: {{ .Name }}-tls-secret\n'})}),"\n",(0,a.jsx)(n.h2,{id:"langflow-ide",children:"langflow-ide"}),"\n",(0,a.jsx)(n.p,{children:"langflow-ide \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'langflow:\n  backend:\n    replicaCount: 1\n    image:\n      repository: langflowai/langflow-backend\n      tag: "v1.1.1"\n    resources:\n      requests:\n        cpu: 0.5\n        memory: 1Gi\n    nodeSelector: {}\n    tolerations: []\n    backendOnly: true\n    env:\n      - name: LANGFLOW_PORT\n        value: "7860"\n      - name: LANGFLOW_LOG_LEVEL\n        value: "info"\n      - name: LANGFLOW_AUTO_LOGIN\n        value: "False"\n      - name: LANGFLOW_SUPERUSER\n        value: "admin"\n      - name: LANGFLOW_SUPERUSER_PASSWORD\n        value: "password"\n      - name: LANGFLOW_SECRET_KEY\n        value: "randomly_generated_secure_key"\n      - name: LANGFLOW_NEW_USER_IS_ACTIVE\n        value: "False"\n    externalDatabase:\n      enabled: true\n      driver:\n        value: "postgresql"\n      host:\n        value: "{{ .Name }}-ide-postgresql-service"\n      port:\n        value: "5432"\n      database:\n        value: "langflow-db"\n      user:\n        value: "langflow"\n      password:\n        valueFrom:\n          secretKeyRef:\n            key: "password"\n            name: "{{ .Name }}-ide-postgresql-service"\n    sqlite:\n      enabled: false\n    probe:\n      failureThreshold: 3\n      periodSeconds: 10\n      timeoutSeconds: 5\n      initialDelaySeconds: 5\n  frontend:\n    enabled: true\n    replicaCount: 1\n    image:\n      repository: langflowai/langflow-frontend\n      tag: "v1.1.1"\n    resources:\n      requests:\n        cpu: 0.3\n        memory: 512Mi\n    nodeSelector: {}\n    tolerations: []\n\ningress:\n  enabled: true\n  annotations:\n    cert-manager.io/cluster-issuer: "selfsigned-issuer" \n    cert-manager.io/duration: 8760h  \n    cert-manager.io/renew-before: 720h\n  hosts:\n    - host: {{ .Name }}.{{ .Domain }}\n      paths:\n        - path: /\n          pathType: ImplementationSpecific\n          servicePort: 7860\n  tls: \n  -  hosts:\n     - {{ .Name }}.{{ .Domain }}\n     secretName: {{ .Name }}-tls-secret\n\npostgresql:\n  enabled: true\n  fullnameOverride: "{{ .Name }}-ide-postgresql-service"\n  auth:\n    username: "langflow"\n    password: "langflow-postgres"\n    database: "langflow-db"\n  primary:\n    persistence:\n      size: 5Gi\n      storageClass: ""\n'})}),"\n",(0,a.jsx)(n.h2,{id:"superset",children:"superset"}),"\n",(0,a.jsx)(n.p,{children:"superset \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'configOverrides: \n  secret: |\n    SECRET_KEY = \'$SECRET_KEY\'\n  enable_oauth: |\n    from flask_appbuilder.security.manager import (AUTH_DB, AUTH_OAUTH)\n    AUTH_TYPE = AUTH_OAUTH\n    OAUTH_PROVIDERS = [\n        {\n            "name": "keycloak",\n            "icon": "fa-key",\n            "token_key": "access_token",\n            "remote_app": {\n                "client_id": "$CLIENT_ID",\n                "client_secret": "$CLIENT_SECRET",\n                "client_kwargs": {\n                  "scope": "openid email profile",\n                  \'verify\': False\n                },\n                \'server_metadata_url\': \'$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/.well-known/openid-configuration\',\n                \'api_base_url\': \'$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/protocol/\'\n            }\n        }\n    ]\n\n    AUTH_ROLE_ADMIN = \'Admin\'\n    AUTH_ROLE_PUBLIC = \'Public\'\n\n    AUTH_USER_REGISTRATION = True\n\n    AUTH_USER_REGISTRATION_ROLE = "Gamma"\n    \n\n\nbootstrapScript: |\n  #!/bin/bash\n  pip install sqlalchemy-drill psycopg2-binary Authlib\n\n\nimage:\n  repository: apachesuperset.docker.scarf.sh/apache/superset\n  tag: ~\n  pullPolicy: IfNotPresent\nresources: {}\nnodeSelector: {}\ntolerations: []\n\n\ningress:\n  enabled: true\n  annotations: \n    cert-manager.io/cluster-issuer: "selfsigned-issuer" \n    cert-manager.io/duration: 8760h  \n    cert-manager.io/renew-before: 720h\n  path: /\n  pathType: ImplementationSpecific\n  hosts:\n  - {{ .Name }}.{{ .Domain }}\n  tls: \n  -  hosts:\n     - {{ .Name }}.{{ .Domain }}\n     secretName: {{ .Name }}-tls-secret\n  \n\n\n\nsupersetNode:\n  replicas:\n    enabled: true\n    replicaCount: 1\n\n  connections:\n    redis_host: \'{{ .Name }}-redis-headless\'\n    redis_port: "6379"\n    redis_user: ""\n    redis_cache_db: "1"\n    redis_celery_db: "0"\n    redis_ssl:\n      enabled: false\n      ssl_cert_reqs: CERT_NONE\n    db_host: \'{{ .Name }}-postgresql\'\n    db_port: "5432"\n    db_user: superset\n    db_pass: superset\n    db_name: superset\n  resources: {}\n\n\nsupersetWorker:\n  replicas:\n    enabled: true\n    replicaCount: 1\n  resources: {}\n  \n\n\nsupersetCeleryBeat:\n  enabled: false\n  resources: {}\n\nsupersetCeleryFlower:\n  enabled: false\n  replicaCount: 1\n  resources: {}\n\npostgresql:\n  enabled: true\n  auth:\n    username: superset\n    password: superset\n    database: superset\n  image:\n    registry: docker.io\n  primary:\n    resources:\n      limits: {}\n      requests:\n        memory: 256Mi\n        cpu: 250m\n    persistence:\n      enabled: true\n      storageClass: ""\n      size: 8Gi\n\nredis:\n  enabled: true\n  architecture: standalone\n  auth:\n    enabled: false    \n    password: superset\n  image:\n    registry: docker.io\n  master:\n    resources:\n      limits: {}\n      requests: {}\n    persistence:\n      enabled: true\n      storageClass: ""\n      size: 8Gi\n'})}),"\n",(0,a.jsx)(n.h2,{id:"ollama",children:"ollama"}),"\n",(0,a.jsx)(n.p,{children:"ollama \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'image:\n  repository: ollama/ollama\n  tag: 0.5.4\n\nruntimeClassName: nvidia\n\npersistentVolume:\n  enabled: true\n  size: "30Gi"\n  storageClass: longhorn\n\nresources:\n  requests:\n    memory: 4096Mi\n    cpu: 2000m\n  limits:\n    memory: 8192Mi\n    cpu: 4000m\n\nollama:\n  gpu:\n    enabled: ture\n    type: \'nvidia\'\n    number: 1\n\n  models:\n    pull:\n      - mistral\n      #- benedict/linkbricks-mistral-nemo-korean:12b\n      #- benedict/linkbricks-gemma2-korean:27b\n      #- qwen2.5-coder:32b\n      #- codeqwen:7b-chat\n      # - llama3\n\ningress:\n  enabled: true\n  annotations: \n    cert-manager.io/cluster-issuer: "selfsigned-issuer" \n    cert-manager.io/duration: 8760h  \n    cert-manager.io/renew-before: 720h\n  hosts:\n  - host: {{ .Name }}.{{ .Domain }}\n    paths:\n      - path: /\n        pathType: Prefix\n  tls: \n    -  hosts:\n       - {{ .Name }}.{{ .Domain }}\n       secretName: {{ .Name }}-tls-secret\n'})}),"\n",(0,a.jsx)(n.h2,{id:"flowise",children:"flowise"}),"\n",(0,a.jsx)(n.p,{children:"flowise \uce74\ud0c8\ub85c\uadf8:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-yaml",children:'image:\n  registry: docker.io\n\npersistence:\n  enabled: true\n  size: 1Gi\n  storageClass: longhorn\n\nresources: {}\n\nconfig:\n  username: flowise\n  password: flowise\n\ningress:\n  enabled: true\n  annotations: \n    cert-manager.io/cluster-issuer: "selfsigned-issuer" \n    cert-manager.io/duration: 8760h  \n    cert-manager.io/renew-before: 720h\n  hosts:\n  - host: {{ .Name }}.{{ .Domain }}\n    paths:\n      - /\n  tls: \n  -  hosts:\n     - {{ .Name }}.{{ .Domain }}\n     secretName: {{ .Name }}-tls-secret\n\npostgresql:\n  enabled: true\n  primary:\n    persistence:\n      enabled: true\n      size: 8Gi\n      storageClass: ""\n'})})]})}function d(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(m,{...e})}):m(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>o});var r=s(6540);const a={},t=r.createContext(a);function i(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),r.createElement(t.Provider,{value:n},e.children)}}}]);