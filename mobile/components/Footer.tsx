import React from 'react';
import { View } from 'react-native';
import Button from '@/components/Button';
import { layout } from '@/styles/common';
import { Entypo, Octicons } from '@expo/vector-icons';

interface FooterProps {
  isScanned: boolean;
  
  // Actions
  onCancel: () => void;
  onContinue?: () => void;
  onAdd?: () => void;
  onFinish?: () => void;
  
  // Configuration des boutons
  continueText?: string;
  addText?: string;
  finishText?: string;
  
  // Navigation
  showBackButton?: boolean;
  onBack?: () => void;
}

// TODO : mieux gérér les états des bouttons

export default function Footer({
  isScanned,
  onCancel,
  onContinue,
  onAdd,
  onFinish,
  continueText = "Continuer",
  addText = "Ajouter",
  finishText = "Terminer",
  showBackButton = false,
  onBack
}: FooterProps) {
  
  const renderButtons = () => {
    if (!isScanned) {
      return (
        <>
          <Button 
            title="Saisir le code" 
            onPress={() => {}} 
            type="outline" 
            icon={<Entypo name="pencil" size={24} color="black" />}
          />
          {showBackButton && onBack ? (
            <Button 
              title="Annuler" 
              onPress={onBack} 
              type="danger" 
              icon={<Entypo name="circle-with-cross" size={24} color="white" />}
            />
          ) : (
            <Button 
              title="Annuler" 
              onPress={onCancel} 
              type="danger" 
              icon={<Entypo name="circle-with-cross" size={24} color="white" />}
            />
          )}
        </>
      );
    }

    // État scanné
    if (onAdd) {
      return (
        <>
          <Button 
            title={addText} 
            onPress={onAdd} 
            type="success" 
            icon={<Octicons name="diff-added" size={24} color="white" />}
          />
          <Button 
            title="Annuler" 
            onPress={onCancel}
            type="danger" 
            icon={<Entypo name="circle-with-cross" size={24} color="white" />}
          />
        </>
      );
    }

    if (onFinish) {
      return (
        <>
          <Button 
            title="Saisir le code" 
            onPress={() => {}} 
            type="outline" 
            icon={<Entypo name="pencil" size={24} color="black" />}
          />
          <Button
            title={finishText}
            onPress={onFinish}
            type="primary"
            icon={<Entypo name="check" size={24} color="white" />}
          />
        </>
      );
    }

    if (onContinue) {
      return (
        <>
          <Button 
            title={continueText} 
            onPress={onContinue} 
            type="success" 
            icon={<Entypo name="arrow-with-circle-right" size={24} color="white" />}
          />
          <Button 
            title="Annuler" 
            onPress={onCancel} 
            type="danger" 
            icon={<Entypo name="circle-with-cross" size={24} color="white" />}
          />
        </>
      );
    }

    return null;
  };

  return (
    <View style={layout.footer}>
      {renderButtons()}
    </View>
  );
} 