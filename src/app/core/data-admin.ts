import { StepModelAdmin } from "./models/step.model";

export const stepsTestDataAdmin: StepModelAdmin[] = [
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
                secretprompt: 'Le problème que votre produit résout est le point de départ de votre entreprise. Il est essentiel de bien comprendre ce problème pour créer un produit qui le résout de manière efficace et rentable.',
                order: 1
            },
            {
                id: 2,
                stepId: 1,
                title: 'Quels produits je pourrai créer ? ',
                desc: `Décrivez les produits que vous pourriez créer pour résoudre le problème identifié.`,
                categoryId: 1,
                secretprompt: 'Il est important de comprendre les différentes options de produits que vous pourriez créer pour résoudre le problème identifié. Cela vous aidera à choisir la meilleure solution pour votre marché cible.',
                order: 2
            },
            {
                id: 3,
                stepId: 1,
                title: 'Le nom de mon produit',
                desc: `Donnez un nom à votre produit.`,
                categoryId: 2,
                secretprompt: 'Le nom de votre produit est un élément clé de votre stratégie de marque. Il doit être mémorable, facile à prononcer et à retenir, et refléter les valeurs et la personnalité de votre entreprise.',
                order: 3
            },
            {
                id: 4,
                stepId: 1,
                title: 'Le slogan de mon produit',
                desc: `Donnez un slogan à votre produit.`,
                categoryId: 2,
                secretprompt: 'Le slogan de votre produit est un élément clé de votre stratégie de marque. Il doit être mémorable, facile à prononcer et à retenir, et refléter les valeurs et la personnalité de votre entreprise.',
                order: 4
            },
            {
                id: 5,
                stepId: 1,
                title: 'Le slogan de mon module',
                desc: `Donnez un slogan à votre module.`,
                categoryId: 3,
                secretprompt: 'Le slogan de votre module est un élément clé de votre stratégie de marque. Il doit être mémorable, facile à prononcer et à retenir, et refléter les valeurs et la personnalité de votre entreprise.',
                order: 5
            }

        ],
        variables: [
            { key: 'avatar', label: '', controltype: 'input', type: 'text', required: true, information: '' },
            { key: 'solution', label: '', controltype: 'input', type: 'text', required: true, information: '' },
            { key: 'product', label: '', controltype: 'input', type: 'text', required: true, information: '' },
            { key: 'email', label: '', controltype: 'input', type: 'text', required: true, information: '' }],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 7,
                stepId: 2,
                title: 'Prompt 5',
                secretprompt: '',
                order: 2
            },
            {
                id: 8,
                stepId: 2,
                title: 'Prompt 6',
                secretprompt: '',
                order: 3
            },
            {
                id: 9,
                stepId: 2,
                title: 'Prompt 7',
                secretprompt: '',
                order: 4
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 11,
                stepId: 3,
                title: 'Prompt 9',
                secretprompt: '',
                order: 2
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 13,
                stepId: 4,
                title: 'Prompt 11',
                secretprompt: '',
                order: 2
            },
            {
                id: 14,
                stepId: 4,
                title: 'Prompt 12',
                secretprompt: '',
                order: 3
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 16,
                stepId: 5,
                title: 'Prompt 14',
                secretprompt: '',
                order: 2
            },
            {
                id: 17,
                stepId: 5,
                title: 'Prompt 15',
                secretprompt: '',
                order: 3
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 19,
                stepId: 6,
                title: 'Prompt 17',
                secretprompt: '',
                order: 2
            },
            {
                id: 20,
                stepId: 6,
                title: 'Prompt 18',
                secretprompt: '',
                order: 3
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 22,
                stepId: 7,
                title: 'Prompt 20',
                secretprompt: '',
                order: 2
            },
            {
                id: 23,
                stepId: 7,
                title: 'Prompt 21',
                secretprompt: '',
                order: 3
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 25,
                stepId: 8,
                title: 'Prompt 23',
                secretprompt: '',
                order: 2
            },
            {
                id: 26,
                stepId: 8,
                title: 'Prompt 24',
                secretprompt: '',
                order: 3
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 28,
                stepId: 9,
                title: 'Prompt 26',
                secretprompt: '',
                order: 2
            },
            {
                id: 29,
                stepId: 9,
                title: 'Prompt 27',
                secretprompt: '',
                order: 3
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 31,
                stepId: 10,
                title: 'Prompt 29',
                secretprompt: '',
                order: 2
            },
            {
                id: 32,
                stepId: 10,
                title: 'Prompt 30',
                secretprompt: '',
                order: 3
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 34,
                stepId: 11,
                title: 'Prompt 32',
                secretprompt: '',
                order: 2
            },
            {
                id: 35,
                stepId: 11,
                title: 'Prompt 33',
                secretprompt: '',
                order: 3
            }
        ],
        variables: [],
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
                secretprompt: '',
                order: 1
            },
            {
                id: 37,
                stepId: 12,
                title: 'Prompt 35',
                secretprompt: '',
                order: 2
            },
            {
                id: 38,
                stepId: 12,
                title: 'Prompt 36',
                secretprompt: '',
                order: 3
            },
            {
                id: 39,
                stepId: 12,
                title: 'Prompt 37',
                secretprompt: '',
                order: 4
            },
            {
                id: 40,
                stepId: 12,
                title: 'Prompt 38',
                secretprompt: '',
                order: 5
            }
        ],
        variables: [],
        order: 12
    }

]