abstract class BaseModel {
  // Convert model to JSON
  Map<String, dynamic> toJson();
  
  @override
  String toString() {
    return toJson().toString();
  }
}