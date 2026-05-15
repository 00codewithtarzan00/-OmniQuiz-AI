export const CLASSES = ['6', '7', '8', '9', '10', '11', '12'];

export const SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Maths',
  'Geography',
  'History',
  'Civics',
  'Economics',
  'English'
];

export const CLASS_TOPICS_MAP: Record<string, Record<string, string[]>> = {
  'Junior (6-8)': {
    'Physics': ['Measurement', 'Force and Pressure', 'Friction', 'Sound', 'Chemical Effects of Current', 'Light', 'Stars and Solar System'],
    'Chemistry': ['Synthetic Fibres and Plastics', 'Metals and Non-metals', 'Coal and Petroleum', 'Combustion and Flame', 'Pollution of Air and Water'],
    'Biology': ['Crop Production and Management', 'Microorganisms', 'Cell Structure and Functions', 'Reproduction in Animals', 'Reaching the Age of Adolescence'],
    'Maths': ['Rational Numbers', 'Linear Equations in One Variable', 'Understanding Quadrilaterals', 'Practical Geometry', 'Data Handling', 'Squares and Square Roots', 'Cubes and Cube Roots', 'Comparing Quantities'],
    'Geography': ['Resources', 'Land, Soil, Water', 'Natural Vegetation and Wildlife', 'Mineral and Power Resources', 'Agriculture', 'Industries', 'Human Resources'],
    'History': ['How, When and Where', 'From Trade to Territory', 'Ruling the Countryside', 'Tribals, Dikus and the Vision of a Golden Age', 'When People Rebel 1857'],
    'Civics': ['The Indian Constitution', 'Understanding Secularism', 'Why do we need a Parliament?', 'Understanding Laws', 'Judiciary', 'Understanding Our Criminal Justice System'],
    'English': ['Nouns and Pronouns', 'Tenses', 'Verbs and Adverbs', 'Prepositions', 'Active and Passive Voice', 'Direct and Indirect Speech', 'Reading Comprehension', 'Short Stories']
  },
  'Secondary (9-10)': {
    'Physics': ['Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound', 'Reflection and Refraction', 'The Human Eye and Colourful World', 'Electricity', 'Magnetic Effects of Current'],
    'Chemistry': ['Matter in Our Surroundings', 'Is Matter Around Us Pure', 'Atoms and Molecules', 'Structure of the Atom', 'Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Periodic Classification'],
    'Biology': ['The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms', 'Why Do We Fall Ill', 'Natural Resources', 'Life Processes', 'Control and Coordination', 'How do Organisms Reproduce', 'Heredity and Evolution'],
    'Maths': ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations in Two Variables', 'Introduction to Euclids Geometry', 'Lines and Angles', 'Triangles', 'Quadrilaterals', 'Circles', 'Herons Formula', 'Surface Areas and Volumes', 'Statistics', 'Probability', 'Trigonometry'],
    'Geography': ['India - Size and Location', 'Physical Features of India', 'Drainage', 'Climate', 'Natural Vegetation and Wildlife', 'Population'],
    'History': ['The French Revolution', 'Socialism in Europe', 'Nazism and the Rise of Hitler', 'Nationalism in India', 'The Making of a Global World', 'The Age of Industrialisation'],
    'Civics': ['What is Democracy?', 'Constitutional Design', 'Electoral Politics', 'Working of Institutions', 'Democratic Rights'],
    'Economics': ['The Story of Village Palampur', 'People as Resource', 'Poverty as a Challenge', 'Food Security in India', 'Development', 'Sectors of the Indian Economy', 'Money and Credit', 'Globalisation'],
    'English': ['Reading Skills', 'Writing Skills with Grammar', 'Literature Textbooks', 'Main Course Book Analytical Paragraphs']
  },
  'Senior (11-12)': {
    'Physics': ['Units and Measurements', 'Kinematics', 'Laws of Motion', 'Work, Energy and Power', 'Thermodynamics', 'Kinetic Theory', 'Oscillations and Waves', 'Electrostatics', 'Current Electricity', 'Optics', 'Atoms and Nuclei', 'Electronic Devices'],
    'Chemistry': ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry Principles', 'Hydrocarbons', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Aldehydes, Ketones and Carboxylic Acids', 'Amines'],
    'Biology': ['Diversity in Living World', 'Structural Organisation in Plants and Animals', 'Cell Structure and Function', 'Plant Physiology', 'Human Physiology', 'Reproduction', 'Genetics and Evolution', 'Biology and Human Welfare', 'Biotechnology', 'Ecology'],
    'Maths': ['Sets, Relations and Functions', 'Trigonometric Functions', 'Principle of Mathematical Induction', 'Complex Numbers', 'Quadratic Equations', 'Permutations and Combinations', 'Binomial Theorem', 'Sequences and Series', 'Straight Lines', 'Conic Sections', 'Calculus', 'Vectors', '3D Geometry', 'Probability'],
    'Geography': ['Fundamentals of Physical Geography', 'India: Physical Environment', 'Fundamentals of Human Geography', 'India: People and Economy'],
    'History': ['Themes in World History', 'Themes in Indian History Part I, II, III'],
    'Civics': ['Indian Constitution at Work', 'Political Theory', 'Contemporary World Politics', 'Politics in India Since Independence'],
    'Economics': ['Statistics for Economics', 'Indian Economic Development', 'Introductory Microeconomics', 'Introductory Macroeconomics'],
    'English': ['Comprehension', 'Creative Writing Skills', 'Literature Text (Flamingo, Vistas)', 'Advanced Grammar']
  }
};

export const LEVELS: string[] = ['Easy', 'Medium', 'Hard'];

export const QUIZ_LENGTHS = [
  { count: 20, minutes: 15 },
  { count: 35, minutes: 25 },
  { count: 50, minutes: 40 }
];
