'use strict';



export
    const   IDLE = 'idle',
            PROCESSING = 'processing',
            PROCESSED = 'processed',
            REPROCESSING = 'reprocessing',
            REPROCESSED = 'reprocessed',
            REPORTING = 'reporting',
            REPORTED = 'reported',
            DEAD = 'dead',

            QUEUE_PROCESS = 'queueprocess',
            QUEUE_REPROCESS = 'queuereprocess',
            QUEUE_REPORT = 'queuereport',

            // misc state
            CREATED = 'created',
            DESTROYED = 'destroyed',

            StateInput = {
                QueueProcess: 'queueprocess',
                Process: 'process',
                EndProcess: 'endprocess',
                Stop: 'stop',
                Die: 'die',
                QueueReport: 'queuereport',
                Report: 'report',
                EndReport: 'endreport'
            },

            STATE_MAP = {

                'idle': {
                    'queueprocess': QUEUE_PROCESS,
                    'die': DEAD
                },

                'queueprocess': {
                    'process': PROCESSING,
                    'die': DEAD
                },

                'processing': {
                    'endprocess': PROCESSED,
                    'die': DEAD
                },

                'processed': {
                    'queueprocess': QUEUE_REPROCESS,
                    'stop': IDLE,
                    'die': DEAD
                },

                'queuereprocess': {
                    'process': REPROCESSING,
                    'die': DEAD
                },

                'reprocessing': {
                    'endprocess': REPROCESSED,
                    'die': DEAD
                },

                'reprocessed': {
                    'queueprocess': QUEUE_REPROCESS,
                    'queuereport': QUEUE_REPORT,
                    'die': DEAD
                },

                'queuereport': {
                    'report': REPORTING,
                    'die': DEAD
                },

                'reporting': {
                    'endreport': REPORTED,
                    'die': DEAD
                },

                'reported': {
                    'process': IDLE,
                    'stop': IDLE,
                    'die': DEAD
                },

                'dead': {}
            };
