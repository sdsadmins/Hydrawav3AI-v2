// Types for AI Intake Form Data

export interface Activity {
    name: string;
    hours: string;
}

export interface DiscomfortArea {
    area: string;
    side: string;
    rom: string;
    description: string;
    painLevel: number;
}

export interface MovementFinding {
    movement: string;
    discomfortLocation: string;
    sensation: string;
}

export interface PersonalDetails {
    firstName: string;
    lastName: string;
    dob: string;
    phone: string;
    email: string;
}

export interface AiIntakeFormData {
    personalDetails: PersonalDetails;
    activities: Activity[];
    discomfortAreas: DiscomfortArea[];
    movementFindings: MovementFinding[];
    painHistory: string;
}

export interface ChatApiRequest {
    formData: AiIntakeFormData;
    instruction?: 'generate' | 'polish' | 'analyze' | 'summarize';
    customPrompt?: string;
}

export interface ChatApiResponse {
    success: boolean;
    message: string;
    data?: {
        response: string;
        suggestions?: string[];
        summary?: string;
    };
    error?: string;
}
