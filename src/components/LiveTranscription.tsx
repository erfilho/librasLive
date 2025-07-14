import { useState, useCallback, useRef, useEffect } from "react";

import {RealtimeClient} from '@/lib/openai-realtime/client/RealtimeClient';

import {
  TranscriptionSessionConfig,
  TranscriptionModel,
  TurnDetectionType,
  ServerEvent,
  ServerEventType,
  AudioFormat,
} from '@/lib/openai-realtime/types';

import { createRealtimeTranscriptionSession } from "@/lib/actions";

