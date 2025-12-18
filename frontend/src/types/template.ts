export interface CardTemplate {
  id: number;
  name: string;
  structureJson: string;
}

export interface FieldDefinition {
  key: string;
  label: string;
  position: "FRONT" | "BACK";
}
