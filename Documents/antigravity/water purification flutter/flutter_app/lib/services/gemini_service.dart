import 'package:google_generative_ai/google_generative_ai.dart';

class GeminiService {
  late final GenerativeModel _model;
  final String apiKey;

  GeminiService({required this.apiKey}) {
    _model = GenerativeModel(
      model: 'gemini-pro',
      apiKey: apiKey,
    );
  }

  // Water purification knowledge base
  static const String knowledgeBase = '''
  You are a water purification expert assistant. You help users understand water quality parameters and purification methods.
  
  Key topics you can help with:
  - Turbidity: Measures water clarity. Lower is better. < 1 NTU is excellent, > 10 NTU is poor.
  - Temperature: Optimal range is 15-30°C for drinking water.
  - Conductivity: Measures dissolved solids. 50-500 µS/cm is good for drinking water.
  - UVC Purification: UV-C light kills bacteria and viruses. Typical cycle is 60 seconds.
  - Water quality standards and safety
  - Common water contaminants and their effects
  - Home water treatment methods
  
  Provide helpful, accurate, and concise answers. If you're unsure, say so.
  ''';

  Future<String> sendMessage(String userMessage) async {
    try {
      final prompt = '$knowledgeBase\n\nUser question: $userMessage\n\nAssistant:';
      final content = [Content.text(prompt)];
      final response = await _model.generateContent(content);

      return response.text ?? 'Sorry, I could not generate a response.';
    } catch (e) {
      throw Exception('Failed to get response from AI: $e');
    }
  }

  Future<String> analyzeWaterQuality({
    required double turbidity,
    required double temperature,
    required double conductivity,
  }) async {
    try {
      final prompt = '''
      $knowledgeBase
      
      Analyze this water quality reading and provide a brief assessment:
      - Turbidity: $turbidity NTU
      - Temperature: $temperature °C
      - Conductivity: $conductivity µS/cm
      
      Provide a concise analysis (2-3 sentences) about the water quality and any concerns.
      ''';

      final content = [Content.text(prompt)];
      final response = await _model.generateContent(content);

      return response.text ?? 'Unable to analyze water quality.';
    } catch (e) {
      throw Exception('Failed to analyze water quality: $e');
    }
  }
}
