
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { addWeeks, format } from 'date-fns';

type Category = 'academics' | 'personal' | null;
type SubCategory = 'student' | 'professor' | 'management' | null;

export type Class = {
    id: string;
    title: string;
    days: number[];
    startTime: string;
    endTime: string;
    location?: string;
    priority: number;
    fixed: boolean;
};

export type Task = {
    id: string;
    title: string;
    estimatedMinutes: number;
    dueDate: string;
    priority: number;
    flexible: boolean;
};

type WorkingHours = {
    [key: string]: { start: string; end: string } | null;
};

type OnboardingAnswers = {
    timezone: string;
    term_start?: string;
    term_end?: string;
    classes: Class[];
    working_hours: WorkingHours;
    preferred_study_times: string[];
    study_block_sizes: number[];
    max_continuous_study_minutes: number;
    min_break_minutes: number;
    preference_weight: 'conservative' | 'aggressive';
    tasks: Task[];
    activities: any[]; // Using any for now for simplicity
    allow_auto_reschedule: boolean;
    notifications_default: number;
};


interface QuestionnaireContextType {
  answers: OnboardingAnswers;
  updateAnswers: (newAnswers: Partial<OnboardingAnswers>) => void;
  category: Category;
  subCategory: SubCategory;
  setCategory: (category: Category) => void;
  setSubCategory: (subCategory: SubCategory) => void;
  getFormattedAnswers: (category: Category, subCategory: SubCategory) => any;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

const defaultAnswers: OnboardingAnswers = {
    timezone: 'Asia/Kolkata',
    classes: [],
    working_hours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: null,
        sunday: null,
    },
    preferred_study_times: [],
    study_block_sizes: [],
    max_continuous_study_minutes: 90,
    min_break_minutes: 10,
    preference_weight: 'conservative',
    tasks: [],
    activities: [],
    allow_auto_reschedule: true,
    notifications_default: 10,
};

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);
  const [category, setCategory] = useState<Category>(null);
  const [subCategory, setSubCategory] = useState<SubCategory>(null);

  const updateAnswers = (newAnswers: Partial<OnboardingAnswers>) => {
    setAnswers(prev => ({ ...prev, ...newAnswers }));
  };

  const getFormattedAnswers = useCallback((category: Category, subCategory: SubCategory) => {
    
    const scheduleDetails = JSON.stringify({
        term_start: answers.term_start || format(new Date(), 'yyyy-MM-dd'),
        term_end: answers.term_end || format(addWeeks(new Date(), 12), 'yyyy-MM-dd'),
        classes: answers.classes,
        tasks: answers.tasks,
        working_hours: answers.working_hours,
        preferences: {
            preferred_study_times: answers.preferred_study_times,
            study_block_sizes: answers.study_block_sizes,
            max_continuous_study_minutes: answers.max_continuous_study_minutes,
            min_break_minutes: answers.min_break_minutes,
            preference_weight: answers.preference_weight,
        },
        activities: answers.activities,
        constraints: {
            allow_auto_reschedule: answers.allow_auto_reschedule,
            notifications_default: answers.notifications_default,
        }
    });

    let payload = {};
    if (category === 'academics' && subCategory === 'student') {
        payload = {
            category: 'Academics',
            subCategory: 'Student',
            collegeName: 'Demo University',
            rollNumber: '12345',
            emailId: 'student@example.com',
            department: 'Computer Science',
            hardSubject: 'Physics',
            scheduleDetails: scheduleDetails
        };
    }
    // Other categories/subcategories would go here
    
    return payload;
  }, [answers]);


  return (
    <QuestionnaireContext.Provider value={{ answers, updateAnswers, category, subCategory, setCategory, setSubCategory, getFormattedAnswers }}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};

// Helper function to add days, as it's not available in date-fns v2
function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
