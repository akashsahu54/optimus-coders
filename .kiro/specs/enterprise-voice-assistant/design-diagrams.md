# System Diagrams

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>3D Avatar]
        B[Vapi Voice Client<br/>Phone Calls]
    end
    
    subgraph "API Gateway"
        C[Express Server<br/>Port 3000]
    end
    
    subgraph "Conversation Endpoints"
        D[/tts Endpoint<br/>Text Input]
        E[/sts Endpoint<br/>Voice Input]
    end
    
    subgraph "Analysis Pipeline"
        F[Analysis Orchestrator]
        G[Sentiment Analyzer]
        H[Urgency Detector]
        I[Fraud Detector]
    end
    
    subgraph "AI Services"
        J[Groq AI<br/>LLaMA 3.3 70B]
        K[OpenAI Whisper<br/>STT]
        L[Eleven Labs<br/>TTS]
    end
    
    subgraph "Data Layer"
        M[(MongoDB<br/>Analysis Records)]
        N[Alert Queue]
        O[Analytics Store]
    end
    
    subgraph "Notification Layer"
        P[Email Service]
        Q[SMS Service]
        R[Webhook Service]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    D --> F
    E --> K
    K --> F
    F --> G
    F --> H
    F --> I
    G --> J
    H --> J
    I --> J
    F --> D
    F --> E
    D --> J
    E --> J
    J --> L
    L --> A
    L --> B
    F --> M
    F --> N
    M --> O
    N --> P
    N --> Q
    N --> R
    
    style F fill:#f9f,stroke:#333,stroke-width:3px
    style G fill:#bbf,stroke:#333,stroke-width:2px
    style H fill:#bbf,stroke:#333,stroke-width:2px
    style I fill:#bbf,stroke:#333,stroke-width:2px
```

## Conversation Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Server
    participant Whisper
    participant Analyzer
    participant GroqAI
    participant ElevenLabs
    participant Database
    participant Alerts
    
    User->>Frontend: Speaks/Types message
    Frontend->>Server: POST /sts or /tts
    
    alt Voice Input (/sts)
        Server->>Whisper: Convert audio to text
        Whisper-->>Server: Transcribed text
    end
    
    Server->>Analyzer: analyzeConversation()
    
    par Parallel Analysis
        Analyzer->>GroqAI: Analyze sentiment
        GroqAI-->>Analyzer: Sentiment result
    and
        Analyzer->>GroqAI: Detect urgency
        GroqAI-->>Analyzer: Urgency result
    and
        Analyzer->>GroqAI: Check fraud patterns
        GroqAI-->>Analyzer: Fraud result
    end
    
    Analyzer-->>Server: Combined analysis
    
    Note over Server: Inject analysis context<br/>into AI prompt
    
    Server->>GroqAI: Generate response with context
    GroqAI-->>Server: AI response
    
    Server->>ElevenLabs: Convert to speech
    ElevenLabs-->>Server: Audio + lip sync
    
    par Async Operations
        Server->>Database: Log analysis
    and
        Server->>Alerts: Process alerts
        Alerts->>Alerts: Check thresholds
        alt High urgency or fraud
            Alerts->>Alerts: Send notifications
        end
    end
    
    Server-->>Frontend: Response + analysis
    Frontend-->>User: Display/Play response
```

## Analysis Pipeline Detail

```mermaid
graph LR
    A[User Message] --> B[Analysis Orchestrator]
    B --> C{Parallel Processing}
    
    C --> D[Sentiment Analyzer]
    C --> E[Urgency Detector]
    C --> F[Fraud Detector]
    
    D --> D1[Groq AI Prompt]
    D1 --> D2[Emotion Classification]
    D2 --> D3[Confidence Score]
    D3 --> D4[Valence/Arousal]
    
    E --> E1[Keyword Detection]
    E --> E2[Sentiment Context]
    E --> E3[Time Sensitivity]
    E --> E4[History Analysis]
    E1 --> E5[Urgency Score]
    E2 --> E5
    E3 --> E5
    E4 --> E5
    E5 --> E6[Level Classification]
    
    F --> F1[Inconsistency Check]
    F --> F2[Pattern Matching]
    F --> F3[Anomaly Detection]
    F --> F4[Geographic Check]
    F1 --> F5[Risk Score]
    F2 --> F5
    F3 --> F5
    F4 --> F5
    F5 --> F6[Risk Level]
    
    D4 --> G[Result Aggregation]
    E6 --> G
    F6 --> G
    
    G --> H{Requires Action?}
    H -->|Yes| I[Generate Alerts]
    H -->|No| J[Log Only]
    
    I --> K[Alert Manager]
    J --> L[Database]
    K --> L
    
    style B fill:#f9f,stroke:#333,stroke-width:2px
    style G fill:#9f9,stroke:#333,stroke-width:2px
    style K fill:#f99,stroke:#333,stroke-width:2px
```

## Data Model Relationships

```mermaid
erDiagram
    CONVERSATION ||--o{ ANALYSIS_RECORD : contains
    ANALYSIS_RECORD ||--o{ ALERT : generates
    ANALYSIS_RECORD ||--|| SENTIMENT : has
    ANALYSIS_RECORD ||--|| URGENCY : has
    ANALYSIS_RECORD ||--|| FRAUD : has
    ALERT ||--o{ NOTIFICATION : sends
    ANALYSIS_RECORD }o--|| CUSTOMER : belongs_to
    
    CONVERSATION {
        string conversationId PK
        string channel
        datetime startTime
        datetime endTime
        int messageCount
    }
    
    ANALYSIS_RECORD {
        string id PK
        string conversationId FK
        datetime timestamp
        string userMessage
        string aiResponse
        string language
        boolean escalated
    }
    
    SENTIMENT {
        string primaryEmotion
        float confidence
        float valence
        float arousal
        json emotionScores
        array indicators
    }
    
    URGENCY {
        string level
        float score
        string category
        boolean requiresEscalation
        array indicators
    }
    
    FRAUD {
        float riskScore
        string riskLevel
        boolean requiresVerification
        array indicators
        json anomalyDetails
    }
    
    ALERT {
        string alertId PK
        string conversationId FK
        string type
        string severity
        string status
        datetime timestamp
    }
    
    NOTIFICATION {
        string channel
        string recipient
        datetime sentAt
        string status
    }
    
    CUSTOMER {
        string customerId PK
        string phoneNumber
        json profile
        json location
    }
```

## Alert Processing Flow

```mermaid
flowchart TD
    A[Analysis Complete] --> B{Check Thresholds}
    
    B -->|Urgency >= 0.6| C[High Urgency Alert]
    B -->|Fraud >= 0.6| D[Fraud Alert]
    B -->|Sentiment = Angry/Frustrated| E[Negative Sentiment Alert]
    B -->|No Threshold Met| F[Log Only]
    
    C --> G[Determine Severity]
    D --> G
    E --> G
    
    G --> H{Severity Level}
    
    H -->|Critical| I[Immediate Notification]
    H -->|High| J[Priority Notification]
    H -->|Medium| K[Standard Notification]
    H -->|Low| L[Dashboard Only]
    
    I --> M[Send Email]
    I --> N[Send SMS]
    I --> O[Trigger Webhook]
    I --> P[Dashboard Alert]
    
    J --> M
    J --> P
    
    K --> P
    
    L --> P
    
    M --> Q[Log Notification]
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R[Update Alert Status]
    
    F --> S[Store in Database]
    R --> S
    
    style I fill:#f99,stroke:#333,stroke-width:2px
    style J fill:#fb9,stroke:#333,stroke-width:2px
    style K fill:#ff9,stroke:#333,stroke-width:2px
    style L fill:#9f9,stroke:#333,stroke-width:2px
```

## Fraud Detection Decision Tree

```mermaid
graph TD
    A[Analyze Conversation] --> B{Inconsistent Info?}
    B -->|Yes| C[+0.3 Risk Score]
    B -->|No| D[Continue]
    
    C --> E{Unusual Requests?}
    D --> E
    
    E -->|Yes| F[+0.2 Risk Score]
    E -->|No| G[Continue]
    
    F --> H{Social Engineering?}
    G --> H
    
    H -->|Yes| I[+0.4 Risk Score]
    H -->|No| J[Continue]
    
    I --> K{Rapid Info Requests?}
    J --> K
    
    K -->|Yes| L[+0.3 Risk Score]
    K -->|No| M[Continue]
    
    L --> N{Geographic Anomaly?}
    M --> N
    
    N -->|Yes| O[+0.25 Risk Score]
    N -->|No| P[Calculate Total]
    
    O --> P
    
    P --> Q{Total Risk Score}
    
    Q -->|>= 0.8| R[Critical Risk]
    Q -->|>= 0.6| S[High Risk]
    Q -->|>= 0.3| T[Medium Risk]
    Q -->|< 0.3| U[Low Risk]
    
    R --> V[Require Verification]
    S --> V
    T --> W[Monitor Closely]
    U --> X[Normal Processing]
    
    V --> Y[Add Verification Steps]
    W --> Z[Log for Review]
    X --> Z
    Y --> Z
    
    style R fill:#f00,color:#fff,stroke:#333,stroke-width:2px
    style S fill:#f90,stroke:#333,stroke-width:2px
    style T fill:#ff0,stroke:#333,stroke-width:2px
    style U fill:#0f0,stroke:#333,stroke-width:2px
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Nginx/ALB]
    end
    
    subgraph "Application Tier"
        APP1[Node.js Instance 1]
        APP2[Node.js Instance 2]
        APP3[Node.js Instance 3]
    end
    
    subgraph "Analysis Services"
        AS1[Analysis Worker 1]
        AS2[Analysis Worker 2]
    end
    
    subgraph "External APIs"
        GROQ[Groq AI API]
        WHISPER[OpenAI Whisper]
        ELEVEN[Eleven Labs]
    end
    
    subgraph "Data Tier"
        MONGO[(MongoDB Cluster)]
        REDIS[(Redis Cache)]
    end
    
    subgraph "Message Queue"
        MQ[RabbitMQ/SQS]
    end
    
    subgraph "Monitoring"
        PROM[Prometheus]
        GRAF[Grafana]
        LOG[ELK Stack]
    end
    
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> MQ
    APP2 --> MQ
    APP3 --> MQ
    
    MQ --> AS1
    MQ --> AS2
    
    AS1 --> GROQ
    AS1 --> WHISPER
    AS1 --> ELEVEN
    AS2 --> GROQ
    AS2 --> WHISPER
    AS2 --> ELEVEN
    
    APP1 --> MONGO
    APP2 --> MONGO
    APP3 --> MONGO
    AS1 --> MONGO
    AS2 --> MONGO
    
    APP1 --> REDIS
    APP2 --> REDIS
    APP3 --> REDIS
    
    APP1 --> PROM
    APP2 --> PROM
    APP3 --> PROM
    AS1 --> PROM
    AS2 --> PROM
    
    PROM --> GRAF
    
    APP1 --> LOG
    APP2 --> LOG
    APP3 --> LOG
    AS1 --> LOG
    AS2 --> LOG
    
    style LB fill:#9cf,stroke:#333,stroke-width:2px
    style MONGO fill:#9f9,stroke:#333,stroke-width:2px
    style MQ fill:#f9f,stroke:#333,stroke-width:2px
```

