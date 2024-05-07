import { StepModel } from "./models/step.model";

export const stepsTestData: StepModel[] = [
    {
        id: 1,
        createdAt: '2021-08-01',
        title: 'Produit',
        subtitle: 'Créer votre produit',
        desc: `Le travail que vous effectuerez ici démystifiera le processus de création d'un produit et vous aidera à éviter les pièges potentiels. Tout se résume à répondre à un besoin réel de votre marché pour votre avatar... c'est ainsi que vous créez un produit que le marché achètera.
        Pour cette section, les variables dont vous aurez besoin sont votre avatar et les éléments de votre solution idéale. Utilisez les sections Identification d'avatar et Solution idéale pour ce travail.`,
        prompts: [
            {
                id: 1,
                stepId: 1,
                title: 'Quel problème mon produit résoud ? ',
                desc: `Décrivez le problème que votre produit résout.`,
                categoryId: 1,
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 2,
                stepId: 1,
                title: 'Quels produits je pourrai créer ? ',
                desc: `Décrivez les produits que vous pourriez créer pour résoudre le problème identifié.`,
                categoryId: 1,
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 3,
                stepId: 1,
                title: 'Le nom de mon produit',
                desc: `Donnez un nom à votre produit.`,
                categoryId: 2,
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 4,
                stepId: 1,
                title: 'Le slogan de mon produit',
                desc: `Donnez un slogan à votre produit.`,
                categoryId: 2,
                order: 4,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 5,
                stepId: 1,
                title: 'Le slogan de mon module',
                desc: `Donnez un slogan à votre module.`,
                categoryId: 3,
                order: 5,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 1
    },
    {
        id: 2,
        createdAt: '2021-08-02',
        title: 'Avatar',
        subtitle: 'Créer votre avatar',
        desc: '',
        prompts: [
            {
                id: 6,
                stepId: 2,
                title: 'Prompt 4',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 7,
                stepId: 2,
                title: 'Prompt 5',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 8,
                stepId: 2,
                title: 'Prompt 6',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 9,
                stepId: 2,
                title: 'Prompt 7',
                order: 4,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 2
    },
    {
        id: 3,
        createdAt: '2021-08-03',
        title: 'Page de vente',
        subtitle: 'Créer votre page de vente.',
        desc: '',
        prompts: [
            {
                id: 10,
                stepId: 3,
                title: 'Prompt 8',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 11,
                stepId: 3,
                title: 'Prompt 9',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 3
    },

    {
        id: 4,
        createdAt: '2021-08-04',
        title: 'Emailing',
        subtitle: 'Créer votre campagne Email.',
        desc: '',
        prompts: [
            {
                id: 12,
                stepId: 4,
                title: 'Prompt 10',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 13,
                stepId: 4,
                title: 'Prompt 11',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 14,
                stepId: 4,
                title: 'Prompt 12',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 4
    },

    {
        id: 5,
        createdAt: '2021-08-05',
        title: 'SMS Marketing',
        subtitle: 'Créer votre campagne SMS.',
        desc: '',
        prompts: [
            {
                id: 15,
                stepId: 5,
                title: 'Prompt 13',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 16,
                stepId: 5,
                title: 'Prompt 14',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 17,
                stepId: 5,
                title: 'Prompt 15',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 5
    },

    {
        id: 6,
        createdAt: '2021-08-06',
        title: 'FB Ads',
        subtitle: 'Créer votre campagne Facebook.',
        desc: '',
        prompts: [
            {
                id: 18,
                stepId: 6,
                title: 'Prompt 16',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 19,
                stepId: 6,
                title: 'Prompt 17',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 20,
                stepId: 6,
                title: 'Prompt 18',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 6
    },

    {
        id: 7,
        createdAt: '2021-08-07',
        title: 'Google Ads',
        subtitle: 'Créer votre campagne Google.',
        desc: '',
        prompts: [
            {
                id: 21,
                stepId: 7,
                title: 'Prompt 19',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 22,
                stepId: 7,
                title: 'Prompt 20',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 23,
                stepId: 7,
                title: 'Prompt 21',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 7
    },

    {
        id: 8,
        createdAt: '2021-08-08',
        title: 'Linkedin Ads',
        subtitle: 'Créer votre campagne Linkedin.',
        desc: '',
        prompts: [
            {
                id: 24,
                stepId: 8,
                title: 'Prompt 22',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 25,
                stepId: 8,
                title: 'Prompt 23',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 26,
                stepId: 8,
                title: 'Prompt 24',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 8
    },

    {
        id: 9,
        createdAt: '2021-08-09',
        title: 'Lancement',
        subtitle: 'Préparer votre lancement.',
        desc: '',
        prompts: [
            {
                id: 27,
                stepId: 9,
                title: 'Prompt 25',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 28,
                stepId: 9,
                title: 'Prompt 26',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 29,
                stepId: 9,
                title: 'Prompt 27',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 9
    },

    {
        id: 10,
        createdAt: '2021-08-10',
        title: 'Offre',
        subtitle: 'Créer une offre irrésistible.',
        desc: '',
        prompts: [
            {
                id: 30,
                stepId: 10,
                title: 'Prompt 28',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 31,
                stepId: 10,
                title: 'Prompt 29',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 32,
                stepId: 10,
                title: 'Prompt 30',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 10
    },

    {
        id: 11,
        createdAt: '2021-08-11',
        title: 'Vendre',
        subtitle: 'Renouveler votre offre.',
        desc: '',
        prompts: [
            {
                id: 33,
                stepId: 11,
                title: 'Prompt 31',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 34,
                stepId: 11,
                title: 'Prompt 32',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 35,
                stepId: 11,
                title: 'Prompt 33',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 11
    },

    {
        id: 12,
        createdAt: '2021-08-12',
        title: 'Convaincre',
        subtitle: 'Venir à bout de vos objections.',
        desc: '',
        prompts: [
            {
                id: 36,
                stepId: 12,
                title: 'Prompt 34',
                order: 1,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 37,
                stepId: 12,
                title: 'Prompt 35',
                order: 2,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 38,
                stepId: 12,
                title: 'Prompt 36',
                order: 3,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 39,
                stepId: 12,
                title: 'Prompt 37',
                order: 4,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            },
            {
                id: 40,
                stepId: 12,
                title: 'Prompt 38',
                order: 5,
                createdAt: '2021-08-01 15:58:00',
                updatedAt: '2021-08-01 12:37:00'
            }
        ],
        stepUservariables: [],
        order: 12
    }

]